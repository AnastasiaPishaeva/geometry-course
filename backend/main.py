from fastapi import FastAPI, APIRouter, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import os

app = FastAPI(
    title="Geometry Course API",
    description="Backend API для онлайн-курса по геометрии",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

api = APIRouter(prefix="/api/v1")

@api.get("/course")
def get_course():
    """
    Возвращает название и описание курса для главной страницы.
    """
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT title, description FROM courses LIMIT 1")
        ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Course not found")

    return dict(result._mapping)

@api.get("/courses/{course_id}/topics-lessons")
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

            topic["lessons"] = [dict(row._mapping) for row in lessons_result]
            topics.append(topic)

    return topics

@api.get("/lessons/{lesson_id}/sections")
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

        sections = [dict(row._mapping) for row in result]

    return sections

@api.get("/users/{user_id}/lessons/{lesson_id}/sections-status")
def get_sections_status_for_lesson(user_id: int, lesson_id: int):
    with engine.connect() as connection:

        sections_result = connection.execute(
            text("""
                SELECT section_id, title, type, order_number
                FROM sections
                WHERE lesson_id = :lesson_id
                ORDER BY order_number
            """),
            {"lesson_id": lesson_id}
        )

        sections = [dict(row._mapping) for row in sections_result]
        section_ids = [s["section_id"] for s in sections]

        progress_map = {}

        if section_ids:
            progress_result = connection.execute(
                text("""
                    SELECT section_id, completed
                    FROM user_progress
                    WHERE user_id = :user_id
                    AND section_id = ANY(:section_ids)
                """),
                {"user_id": user_id, "section_ids": section_ids}
            )

            progress_map = {
                row._mapping["section_id"]: row._mapping["completed"]
                for row in progress_result
            }

        for section in sections:
            section["completed"] = progress_map.get(section["section_id"], False)

    return sections

@api.get("/users/{user_id}/stars")
def get_user_stars(user_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT SUM(stars_earned)
                FROM user_progress
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).fetchone()

    total_stars = result[0] if result and result[0] is not None else 0
    return {"total_stars": total_stars}

@api.post("/users/{user_id}/sections/{section_id}/progress")
def add_section_progress(
    user_id: int,
    section_id: int,
    stars_earned: int = Body(..., embed=True)
):
    """
    Обновляет прогресс пользователя по секции.
    """

    with engine.begin() as connection:
        existing = connection.execute(
            text("""
                SELECT user_progress_id
                FROM user_progress
                WHERE user_id = :user_id
                AND section_id = :section_id
            """),
            {"user_id": user_id, "section_id": section_id}
        ).fetchone()

        if existing:
            connection.execute(
                text("""
                    UPDATE user_progress
                    SET completed = TRUE,
                        stars_earned = :stars_earned
                    WHERE user_id = :user_id
                    AND section_id = :section_id
                """),
                {
                    "stars_earned": stars_earned,
                    "user_id": user_id,
                    "section_id": section_id
                }
            )
        else:
            connection.execute(
                text("""
                    INSERT INTO user_progress
                    (user_id, section_id, completed, stars_earned)
                    VALUES (:user_id, :section_id, TRUE, :stars_earned)
                """),
                {
                    "user_id": user_id,
                    "section_id": section_id,
                    "stars_earned": stars_earned
                }
            )

    return {
        "message": "Progress updated successfully",
        "section_id": section_id,
        "stars_earned": stars_earned
    }

app.include_router(api)

@api.get("/courses/{course_id}/introduction")
def get_course_introduction(course_id: int):
    """
    Возвращает текст введения курса.
    """

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT introduction
                FROM courses
                WHERE course_id = :course_id
            """),
            {"course_id": course_id}
        ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"introduction": result._mapping["introduction"]}