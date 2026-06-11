from fastapi import (
    FastAPI,
    APIRouter,
    Body,
    HTTPException,
    Response,
    Cookie
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from pydantic import BaseModel, Field
import os
import hashlib
import secrets
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="Geometry Course API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://anastasiapishaeva.github.io" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://juliachezryakova@localhost:5432/geometry_course"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)
api = APIRouter(prefix="/api/v1")

class ProgressPayload(BaseModel):
    stars_earned: int = Field(0, ge=0)


class RegistrationPayload(BaseModel):
    email: str
    password: str = Field(min_length=6, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)


class LoginPayload(BaseModel):
    email: str
    password: str = Field(min_length=1, max_length=128)

class RequiredStarsUpdate(BaseModel):
    required_stars: int

class UpdateUserPayload(BaseModel):
    email: str | None = None
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)

def normalize_email(email: str) -> str:
    return email.strip().lower()


def hash_password(password: str, salt_hex: str | None = None) -> str:
    if salt_hex is None:
        salt_hex = secrets.token_hex(16)

    salt = bytes.fromhex(salt_hex)
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000
    ).hex()
    return f"{salt_hex}${pwd_hash}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_hex, _ = stored_hash.split("$", 1)
    except ValueError:
        return False

    candidate_hash = hash_password(password, salt_hex=salt_hex)
    return secrets.compare_digest(candidate_hash, stored_hash)


def ensure_auth_tables() -> None:
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))

        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(user_id),
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))


ensure_auth_tables()

@api.post(
    "/auth/register",
    summary="Регистрация пользователя",
    description="Необходимо ввести email, пароль, имя и фамилию"
)
def register(payload: RegistrationPayload):
    email = normalize_email(payload.email)
    password_hash = hash_password(payload.password)

    with engine.begin() as connection:
        existing_user = connection.execute(
            text("SELECT user_id FROM users WHERE email = :email"),
            {"email": email}
        ).fetchone()

        if existing_user:
            raise HTTPException(status_code=409, detail="User already exists")

        created_user = connection.execute(
            text("""
                INSERT INTO users (email, password_hash, first_name, last_name)
                VALUES (:email, :password_hash, :first_name, :last_name)
                RETURNING user_id, email, first_name, last_name
            """),
            {
                "email": email,
                "password_hash": password_hash,
                "first_name": payload.first_name.strip(),
                "last_name": payload.last_name.strip()
            }
        ).fetchone()

    return {"user": dict(created_user._mapping)}

@api.post(
    "/auth/login",
    summary="Вход пользователя",
    description="Необходимо ввести email и пароль"
)
def login(
    payload: LoginPayload,
    response: Response
):
    email = normalize_email(payload.email)

    with engine.connect() as connection:
        user_row = connection.execute(
            text("""
                SELECT
                    user_id,
                    email,
                    first_name,
                    last_name,
                    password_hash
                FROM users
                WHERE email = :email
            """),
            {"email": email}
        ).fetchone()

    if not user_row:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    user = dict(user_row._mapping)

    if not verify_password(
        payload.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    session_token = secrets.token_urlsafe(32)

    with engine.begin() as connection:
        connection.execute(
            text("""
                INSERT INTO sessions (
                    session_token,
                    user_id
                )
                VALUES (
                    :session_token,
                    :user_id
                )
            """),
            {
                "session_token": session_token,
                "user_id": user["user_id"]
            }
        )

        response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 30
    )

    return {
        "success": True
    }

@api.get("/auth/me")
def get_me(
    session_token: str | None = Cookie(default=None)
):
    if not session_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    u.user_id,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.created_at
                FROM users u
                JOIN sessions s
                    ON s.user_id = u.user_id
                WHERE s.session_token = :token
            """),
            {"token": session_token}
        ).fetchone()

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid session"
        )

    return dict(result._mapping)
@api.post("/auth/logout")
def logout(
    response: Response,
    session_token: str | None = Cookie(default=None)
):
    if session_token:
        with engine.begin() as connection:
            connection.execute(
                text("""
                    DELETE FROM sessions
                    WHERE session_token = :token
                """),
                {"token": session_token}
            )

    response.delete_cookie("session_token")

    return {"success": True}

@api.get(
    "/users/{user_id}",
    summary="Получение пользователя по ID",
    description="Возвращает id, email, имя, фамилию и дату создания"
)
def get_user(user_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT user_id, email, first_name, last_name, created_at
                FROM users
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(result._mapping)


@api.put(
    "/users/{user_id}",
    summary="Редактирование пользователя",
    description="Необходимо ввести id пользователя и новые параметры (email, first_name, last_name)"
)
def update_user(user_id: int, payload: UpdateUserPayload):
    update_fields = {}

    if payload.email:
        update_fields["email"] = normalize_email(payload.email)
    if payload.first_name:
        update_fields["first_name"] = payload.first_name.strip()
    if payload.last_name:
        update_fields["last_name"] = payload.last_name.strip()

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    with engine.begin() as connection:
        existing = connection.execute(
            text("SELECT user_id FROM users WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).fetchone()

        if not existing:
            raise HTTPException(status_code=404, detail="User not found")

        if "email" in update_fields:
            email_exists = connection.execute(
                text("""
                    SELECT user_id FROM users
                    WHERE email = :email AND user_id != :user_id
                """),
                {**update_fields, "user_id": user_id}
            ).fetchone()

            if email_exists:
                raise HTTPException(status_code=409, detail="Email already in use")

        set_clause = ", ".join([f"{k} = :{k}" for k in update_fields])

        query = text(f"""
            UPDATE users
            SET {set_clause}
            WHERE user_id = :user_id
            RETURNING user_id, email, first_name, last_name
        """)

        update_fields["user_id"] = user_id
        updated = connection.execute(query, update_fields).fetchone()

    return dict(updated._mapping)

@api.get(
    "/course",
    summary="Получение курса",
    description="Выдаются заголовок и описание"
)
def get_course():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT title, description FROM courses LIMIT 1")
        ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Course not found")

    return dict(result._mapping)


@api.get(
    "/courses/{course_id}/topics-lessons",
    summary="Получение тем и уроков",
    description=(
        "Возвращает по id курса топики курса (введение, треугольники, многоугольники) "
        "и уроки внутри этих топиков. Для топиков возвращаются id, заголовок, порядок и массив уроков. "
        "Для уроков возвращаются id урока, заголовок и порядок."
    )
)
def get_topics_with_lessons(course_id: int):
    with engine.connect() as connection:
        topics_result = connection.execute(
            text("""
                SELECT topic_id, title, order_number
                FROM topics
                WHERE course_id = :course_id
                ORDER BY order_number
            """),
            {"course_id": course_id}
        )

        topics = []

        for topic_row in topics_result:
            topic = dict(topic_row._mapping)

            lessons_result = connection.execute(
                text("""
                    SELECT lesson_id, title, order_number
                    FROM lessons
                    WHERE topic_id = :topic_id
                    ORDER BY order_number
                """),
                {"topic_id": topic["topic_id"]}
            )

            topic["lessons"] = [dict(r._mapping) for r in lessons_result]
            topics.append(topic)

    return topics


@api.get(
    "/lessons/{lesson_id}/sections",
    summary="Получение секций по уроку",
    description=(
        "После ввода id урока возвращает секции этого урока: "
        "id секции, заголовок, текст секции и порядок."
    )
)
def get_sections_for_lesson(lesson_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT section_id, title, theory_text, order_number
                FROM sections
                WHERE lesson_id = :lesson_id
                ORDER BY order_number
            """),
            {"lesson_id": lesson_id}
        )

    return [dict(r._mapping) for r in result]


@api.get(
    "/users/{user_id}/lessons/{lesson_id}/sections-status",
    summary="Получение всей информации о секциях у пользователя",
    description=(
        "Необходимо ввести id пользователя и id урока. "
        "Возвращает: id секции, id урока, описание, тип и статус выполнения (completed)."
    )
)
def get_sections_status(user_id: int, lesson_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT 
                    s.section_id,
                    s.lesson_id,
                    s.title,
                    s.order_number,
                    s.type,
                    COALESCE(up.completed, FALSE) AS completed
                FROM sections s
                LEFT JOIN user_progress up
                    ON up.section_id = s.section_id
                    AND up.user_id = :user_id
                WHERE s.lesson_id = :lesson_id
                ORDER BY s.order_number
            """),
            {"user_id": user_id, "lesson_id": lesson_id}
        )

    return [dict(r._mapping) for r in result]

@api.get(
    "/users/{user_id}/stars",
    summary="Получение звёзд пользователя",
    description="Получение общего количества звёзд пользователя по user_id"
)
def get_user_stars(user_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT COALESCE(SUM(stars_earned), 0) AS total_stars
                FROM user_progress
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).fetchone()

    return {
        "user_id": user_id,
        "total_stars": result.total_stars
    }

@api.post(
    "/users/{user_id}/sections/{section_id}/status",
    summary="Добавление статуса секции",
    description="По user_id и section_id можно добавить или изменить статус выполнения секции"
)
def set_section_completed(
    user_id: int,
    section_id: int,
    completed: bool = Body(True, embed=True)
):
    with engine.begin() as connection:
        exists = connection.execute(
            text("SELECT 1 FROM sections WHERE section_id = :section_id"),
            {"section_id": section_id}
        ).fetchone()

        if not exists:
            raise HTTPException(status_code=404, detail="Section not found")

        existing = connection.execute(
            text("""
                SELECT user_progress_id
                FROM user_progress
                WHERE user_id = :user_id AND section_id = :section_id
            """),
            {"user_id": user_id, "section_id": section_id}
        ).fetchone()

        if existing:
            connection.execute(
                text("""
                    UPDATE user_progress
                    SET completed = :completed
                    WHERE user_id = :user_id AND section_id = :section_id
                """),
                {"completed": completed, "user_id": user_id, "section_id": section_id}
            )
        else:
            connection.execute(
                text("""
                    INSERT INTO user_progress (user_id, section_id, completed, stars_earned)
                    VALUES (:user_id, :section_id, :completed, 0)
                """),
                {"user_id": user_id, "section_id": section_id, "completed": completed}
            )

    return {"section_id": section_id, "completed": completed}


@api.post(
    "/users/{user_id}/sections/{section_id}/progress",
    summary="Добавление звёзд",
    description="Добавление звёзд для секции по user_id и section_id"
)
def add_progress(user_id: int, section_id: int, payload: ProgressPayload):
    with engine.begin() as connection:
        existing = connection.execute(
            text("""
                SELECT user_progress_id
                FROM user_progress
                WHERE user_id = :user_id AND section_id = :section_id
            """),
            {"user_id": user_id, "section_id": section_id}
        ).fetchone()

        if existing:
            connection.execute(
                text("""
                    UPDATE user_progress
                    SET completed = TRUE, stars_earned = :stars
                    WHERE user_id = :user_id AND section_id = :section_id
                """),
                {
                    "stars": payload.stars_earned,
                    "user_id": user_id,
                    "section_id": section_id
                }
            )
        else:
            connection.execute(
                text("""
                    INSERT INTO user_progress (user_id, section_id, completed, stars_earned)
                    VALUES (:user_id, :section_id, TRUE, :stars)
                """),
                {
                    "user_id": user_id,
                    "section_id": section_id,
                    "stars": payload.stars_earned
                }
            )

    return {"section_id": section_id, "stars": payload.stars_earned}
@api.get(
    "/lessons/{lesson_id}/required-stars",
    summary="Получить количество необходимых звезд"
)
def get_required_stars(
    lesson_id: int
):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    lesson_id,
                    required_stars
                FROM lessons
                WHERE lesson_id = :lesson_id
            """),
            {
                "lesson_id": lesson_id
            }
        ).fetchone()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    return dict(result._mapping)

@api.put(
    "/lessons/{lesson_id}/required-stars",
    summary="Изменить количество необходимых звезд"
)
def update_required_stars(
    lesson_id: int,
    payload: RequiredStarsUpdate
):
    with engine.begin() as connection:
        updated = connection.execute(
            text("""
                UPDATE lessons
                SET required_stars = :stars
                WHERE lesson_id = :lesson_id
                RETURNING
                    lesson_id,
                    required_stars
            """),
            {
                "lesson_id": lesson_id,
                "stars": payload.required_stars
            }
        ).fetchone()

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    return dict(updated._mapping)


app.include_router(api)

