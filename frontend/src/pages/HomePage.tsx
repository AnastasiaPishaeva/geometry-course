import Banner from "../widgets/Banner.tsx";
import {Grid, Typography, Box} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CourseProgramItem from "../widgets/CourseProgramItem.tsx";
import QuestionItem from "../widgets/QuestionItem.tsx";


const HomePage = () => {
    const theme = useTheme();
    return (
        <Grid container justifyContent="center" sx={{ height: "100%", overflow: "hidden"}}>
            <Banner />
            <Grid size={{ xs: 8 }}
                sx={{
                    mt: "60px",
                    alignItems: "center",
                    flexDirection: "column",
                    display: "flex"
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        color: theme.palette.primaryScale[200],
                        textAlign: "center"
                    }}
                >
                    Программа курса
                </Typography>
                <CourseProgramItem number="1" name="Введение" isLarge={true} />
                <CourseProgramItem number="2" name="Треугольники" isLarge={true}/>
                <CourseProgramItem number="2.1" name="Урок 1" isLarge={false}/>
                <CourseProgramItem number="2.2" name="Урок 2" isLarge={false}/>
                <CourseProgramItem number="2.3" name="Урок 3" isLarge={false}/>
                <CourseProgramItem number="3" name="Многоугольники" isLarge={true}/>
            </Grid>
            <Typography
                variant="h2"
                sx={{
                    mt: "60px",
                    color: theme.palette.primaryScale[200],
                    textAlign: "center"
                }}
            >
                В процессе обучения пользователь
            </Typography>
            <Grid
                  sx={{
                      mt: "42px",
                      flexDirection: "row",
                      display: "flex",
                      width: "100%"
                  }}
            >
                <Grid size={{ xs: 3 }} sx={{flexDirection: "column", alignItems: "center"}}>
                    <Box
                        component="img"
                        src="/src/assets/HomePage/mp1.svg"
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            mt: "10px",
                            color: theme.palette.primaryScale[100],
                            textAlign: "center"
                        }}
                    >
                        Проходит игровые уровни по темам геометрии
                    </Typography>
                </Grid>

                <Grid size={{ xs: 3 }} sx={{flexDirection: "column", alignItems: "center"}}>
                    <Box
                        component="img"
                        src="/src/assets/HomePage/mp2.svg"
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            mt: "10px",
                            color: theme.palette.primaryScale[100],
                            textAlign: "center"
                        }}
                    >
                        Решает задачи и мини-игры
                    </Typography>
                </Grid>

                <Grid size={{ xs: 3 }} sx={{flexDirection: "column", alignItems: "center"}}>
                    <Box
                        component="img"
                        src="/src/assets/HomePage/mp3.svg"
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            mt: "10px",
                            color: theme.palette.primaryScale[100],
                            textAlign: "center"
                        }}
                    >
                        Зарабатывает баллы и достижения
                    </Typography>
                </Grid>

                <Grid size={{ xs: 3 }} sx={{flexDirection: "column", alignItems: "center"}}>
                    <Box
                        component="img"
                        src="/src/assets/HomePage/mp4.svg"
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            mt: "10px",
                            color: theme.palette.primaryScale[100],
                            textAlign: "center"
                        }}
                    >
                        Закрепляет знания без перегрузок и стресса
                    </Typography>
                </Grid>
            </Grid>

            <Typography
                variant="h2"
                sx={{
                    mt: "60px",
                    color: theme.palette.primaryScale[200],
                    textAlign: "center"
                }}
            >
                Часто задаваемые вопросы
            </Typography>

            <Grid size={{ xs: 8 }}
                  sx={{
                      mt: "24px",
                      alignItems: "center",
                      flexDirection: "column",
                      display: "flex"
                  }}
            >
                <QuestionItem name="Сколько времени длится курс?" description="Курс рассчитан примерно на 3–4 месяца обучения. Ребёнок проходит его в удобном темпе: обычно достаточно 20–30 минут в день 3–4 раза в неделю. Материал разбит на небольшие уровни, поэтому заниматься легко и не утомительно." />
                <QuestionItem name="Нужно ли хорошо знать математику, чтобы начать?" description="Нет. Курс подходит даже тем, кому геометрия пока кажется сложной или непонятной. Мы начинаем с базовых понятий и объясняем темы наглядно и пошагово, поэтому ребёнок постепенно разберётся во всех основных темах 6–8 классов."/>
                <QuestionItem name="Чем курс отличается от обычных уроков геометрии?" description="В обычной школе часто приходится просто читать теорию и решать однотипные задачи. В нашем курсе геометрия изучается через интерактивные задания и игровые механики: уровни и миссии, визуальные примеры и наглядные построения, мгновенная проверка решений, награды и достижения за прогресс. Это помогает понять логику задач, а не просто заучить формулы."/>
                <QuestionItem name="Ребенок будет играть или учиться?" description="И то и другое. Игровые элементы помогают сделать обучение интересным, но все задания направлены на изучение геометрии. Ребёнок проходит уровни, решает задачи и получает награды за правильные решения, поэтому процесс похож на игру, но при этом он постепенно осваивает важные математические темы и развивает навыки решения задач, даже не чувствуя привычной школьной нагрузки."/>
                <QuestionItem name="Что ребенок будет уметь после курса?" description="После прохождения курса ребёнок будет понимать основные темы геометрии 6–8 классов, научится решать задачи на углы, треугольники, окружности и площади, станет увереннее чувствовать себя на уроках и контрольных работах и лучше понимать логику математических задач. В результате геометрия перестанет казаться сложной и станет понятной и интересной."/>
        </Grid>
        </Grid>
    );
}
export default HomePage;
