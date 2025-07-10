import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { sendEmail, initEmailJS } from "@/utils/emailService";

const Index = () => {
  const [totalReviews, setTotalReviews] = useState("");
  const [reviews5, setReviews5] = useState("");
  const [reviews4, setReviews4] = useState("");
  const [reviews3, setReviews3] = useState("");
  const [reviews2, setReviews2] = useState("");
  const [reviews1, setReviews1] = useState("");
  const [results, setResults] = useState<{ rating: number; needed: number }[]>(
    [],
  );

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    reviewCount: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация EmailJS при загрузке компонента
  useEffect(() => {
    initEmailJS();
  }, []);

  const calculateReviews = () => {
    const total = parseInt(totalReviews);
    const r5 = parseInt(reviews5) || 0;
    const r4 = parseInt(reviews4) || 0;
    const r3 = parseInt(reviews3) || 0;
    const r2 = parseInt(reviews2) || 0;
    const r1 = parseInt(reviews1) || 0;

    if (total && r5 + r4 + r3 + r2 + r1 === total) {
      // Текущий рейтинг: (5*количество_5звезд + 4*количество_4звезд + ... + 1*количество_1звезда) / общее_количество
      const currentRating =
        (5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1) / total;
      const calculatedResults = [];

      // Расчет для рейтингов от 4.5 до 5.0 с шагом 0.1
      for (let targetRating = 4.5; targetRating <= 5.0; targetRating += 0.1) {
        if (targetRating > currentRating) {
          // Правильная формула для расчета необходимых 5-звездочных отзывов:
          // Пусть N - количество нужных 5-звездочных отзывов
          // Новый рейтинг = (текущая_сумма_баллов + 5*N) / (текущее_количество + N) = целевой_рейтинг
          // Решаем уравнение: текущая_сумма_баллов + 5*N = целевой_рейтинг * (текущее_количество + N)
          // N = (целевой_рейтинг * текущее_количество - текущая_сумма_баллов) / (5 - целевой_рейтинг)

          const currentTotalScore = 5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1;
          const numerator = targetRating * total - currentTotalScore;
          const denominator = 5 - targetRating;

          const needed = Math.ceil(numerator / denominator);

          if (needed > 0 && denominator > 0) {
            calculatedResults.push({
              rating: Math.round(targetRating * 10) / 10,
              needed: needed,
            });
          }
        }
      }

      setResults(calculatedResults);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Отправляем email
      const emailSent = await sendEmail(formData);

      if (emailSent) {
        // Если email отправлен успешно, также открываем Telegram
        const message = `Добрый день! Хочу заказать у вас отзывы, я пришел к вам с сайта) Хочу заказать ${formData.reviewCount} отзывов`;
        const telegramUrl = `https://t.me/cupozon_mp?text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, "_blank");

        // Очищаем форму
        setFormData({
          fullName: "",
          contact: "",
          reviewCount: "",
          comment: "",
        });

        alert(
          "Заявка отправлена на email и подготовлена для Telegram! Отправьте сообщение в Telegram для завершения.",
        );
      } else {
        // Если email не отправился, все равно открываем Telegram
        const message = `Добрый день! Хочу заказать у вас отзывы, я пришел к вам с сайта) Хочу заказать ${formData.reviewCount} отзывов`;
        const telegramUrl = `https://t.me/cupozon_mp?text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, "_blank");

        alert(
          "Заявка подготовлена для Telegram! Отправьте сообщение в Telegram для завершения.",
        );
      }
    } catch (error) {
      alert("Произошла ошибка. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Icon name="ShoppingCart" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                CUPOZON
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Главная
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Как работает
              </a>
              <a
                href="#calculator"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Калькулятор
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Прайс
              </a>
              <a
                href="#reviews"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Отзывы
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Связаться
              </a>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() =>
                document
                  .getElementById("contact-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Начать работу
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="bg-blue-100 text-blue-700 mb-6">
                Профессиональные услуги самовыкупов
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Увеличьте рейтинг товаров на
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  {" "}
                  Озоне
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Профессиональные услуги самовыкупов и накрутки отзывов для
                повышения позиций ваших товаров в поисковой выдаче маркетплейса
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
                  onClick={() =>
                    document
                      .getElementById("calculator")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="Calculator" size={20} className="mr-2" />
                  Рассчитать отзывы
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Как это работает
                </Button>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-lg font-semibold w-full sm:w-auto"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="ShoppingCart" size={24} className="mr-3" />
                  Заказать отзывы
                </Button>
              </div>
            </div>
            <div className="animate-scale-in">
              <img
                src="/img/c0bed09e-a26f-4d8a-b7e5-4c66ccd951b4.jpg"
                alt="Ozon marketplace services"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                500000+
              </div>
              <div className="text-gray-600">Выполненных заказов</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl lg:text-4xl font-bold text-green-500 mb-2">
                98%
              </div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Поддержка клиентов</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl lg:text-4xl font-bold text-green-500 mb-2">
                3 года
              </div>
              <div className="text-gray-600">Опыт работы</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section
        id="calculator"
        className="py-20 bg-gradient-to-r from-blue-50 to-green-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Калькулятор отзывов
            </h2>
            <p className="text-xl text-gray-600">
              Узнайте, сколько отзывов нужно для достижения рейтинга от 4.5
              звезд
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calculator" size={24} className="text-blue-600" />
                Расчет необходимых отзывов
              </CardTitle>
              <CardDescription>
                Введите распределение ваших отзывов по звездам для точного
                расчета
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total-reviews">
                    Общее количество отзывов
                  </Label>
                  <Input
                    id="total-reviews"
                    type="number"
                    value={totalReviews}
                    onChange={(e) => setTotalReviews(e.target.value)}
                    placeholder="150"
                  />
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      5 звезд
                    </Label>
                    <Input
                      type="number"
                      value={reviews5}
                      onChange={(e) => setReviews5(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      4 звезды
                    </Label>
                    <Input
                      type="number"
                      value={reviews4}
                      onChange={(e) => setReviews4(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      3 звезды
                    </Label>
                    <Input
                      type="number"
                      value={reviews3}
                      onChange={(e) => setReviews3(e.target.value)}
                      placeholder="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      2 звезды
                    </Label>
                    <Input
                      type="number"
                      value={reviews2}
                      onChange={(e) => setReviews2(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      1 звезда
                    </Label>
                    <Input
                      type="number"
                      value={reviews1}
                      onChange={(e) => setReviews1(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={calculateReviews}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <Icon name="Zap" size={20} className="mr-2" />
                Рассчитать
              </Button>

              {results.length > 0 && (
                <div className="mt-6 space-y-4 animate-scale-in">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Результаты расчета:
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                      >
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600 mb-1">
                            {result.needed} отзывов
                          </div>
                          <p className="text-sm text-gray-700">
                            для рейтинга {result.rating.toFixed(1)} ⭐
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-6">
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 font-semibold"
                      onClick={() =>
                        document
                          .getElementById("contact-form")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      Заказать отзывы
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-r from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Прайс на услуги
            </h2>
            <p className="text-xl text-gray-600">
              Прозрачные цены на выкупы с отзывами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    250 ₽
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    за выкуп+отзыв
                  </div>
                  <div className="text-xs text-gray-500">1-50 выкупов</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg border-0 hover:shadow-xl transition-shadow transform scale-105">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold mb-1">150 ₽</div>
                  <div className="text-xs opacity-90 mb-1">за выкуп+отзыв</div>
                  <div className="text-xs opacity-90">51-200 выкупов</div>
                  <Badge className="mt-2 bg-white text-green-600 text-xs">
                    ПОПУЛЯРНЫЙ
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    130 ₽
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    за выкуп+отзыв
                  </div>
                  <div className="text-xs text-gray-500">200-300 выкупов</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 mb-1">
                    100 ₽
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    за выкуп+отзыв
                  </div>
                  <div className="text-xs text-gray-500">300-500 выкупов</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    80 ₽
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    за выкуп+отзыв
                  </div>
                  <div className="text-xs text-gray-500">500-1000 выкупов</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 mb-1">
                    60 ₽
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    за выкуп+отзыв
                  </div>
                  <div className="text-xs text-gray-500">1000+ выкупов</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Как это работает
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Простой процесс в 4 этапа для увеличения рейтинга ваших товаров
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon
                  name="MessageSquare"
                  size={32}
                  className="text-blue-600"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Консультация</h3>
              <p className="text-gray-600">Обсуждаем ваши товары и цели</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Стратегия</h3>
              <p className="text-gray-600">Разрабатываем план продвижения</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Выполнение</h3>
              <p className="text-gray-600">Работаем с отзывами и рейтингом</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="TrendingUp" size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Результат</h3>
              <p className="text-gray-600">Ваш товар в топе поиска</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-gray-600">
              Что говорят о нас наши партнеры
            </p>
          </div>

          <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Рейтинг нашего товара вырос с 4.1 до 4.7 за месяц. Продажи
                  увеличились в 3 раза!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">А</span>
                  </div>
                  <div>
                    <div className="font-semibold">Александр</div>
                    <div className="text-sm text-gray-500">
                      Продавец электроники
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Профессиональный подход и быстрые результаты. Товары стали
                  лучше ранжироваться."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">М</span>
                  </div>
                  <div>
                    <div className="font-semibold">Мария</div>
                    <div className="text-sm text-gray-500">
                      Владелец магазина одежды
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Отличная команда! Помогли выйти в топ поиска по ключевым
                  запросам."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">Д</span>
                  </div>
                  <div>
                    <div className="font-semibold">Дмитрий</div>
                    <div className="text-sm text-gray-500">
                      Интернет-магазин
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "За 2 недели подняли товар с 3.8 до 4.6 звезд. Заказы пошли!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">И</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ирина</div>
                    <div className="text-sm text-gray-500">
                      Магазин косметики
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Работают быстро и качественно. Никаких блокировок, все
                  чисто."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold">С</span>
                  </div>
                  <div>
                    <div className="font-semibold">Сергей</div>
                    <div className="text-sm text-gray-500">Товары для дома</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Рекомендую! Адекватные цены, хорошее качество работы."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-semibold">Е</span>
                  </div>
                  <div>
                    <div className="font-semibold">Елена</div>
                    <div className="text-sm text-gray-500">
                      Спортивные товары
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Сотрудничаем уже полгода. Стабильно высокое качество услуг."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-semibold">В</span>
                  </div>
                  <div>
                    <div className="font-semibold">Виктор</div>
                    <div className="text-sm text-gray-500">Автозапчасти</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Помогли запустить новый товар. Отзывы появились быстро."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-pink-600 font-semibold">Н</span>
                  </div>
                  <div>
                    <div className="font-semibold">Наталья</div>
                    <div className="text-sm text-gray-500">Детские товары</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        id="contact-form"
        className="py-20 bg-gradient-to-r from-blue-50 to-green-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Обратная связь
            </h2>
            <p className="text-xl text-gray-600">
              Оставьте заявку и мы свяжемся с вами для обсуждения деталей
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">ФИО *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">
                    Аккаунт в Telegram или номер телефона *
                  </Label>
                  <Input
                    id="contact"
                    type="text"
                    placeholder="@username или +7 (999) 123-45-67"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Количество отзывов *</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    placeholder="100"
                    value={formData.reviewCount}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewCount: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий (необязательно)</Label>
                  <textarea
                    id="comment"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Опишите дополнительную информацию о вашем заказе..."
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                  onClick={() =>
                    window.open("https://t.me/m/5iV3CeuSNjcy", "_blank")
                  }
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
            Преимущества работы с нами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Без штрафов и блокировок
              </h3>
              <p className="text-gray-600">
                Работаем безопасно, исключая риски для вашего аккаунта
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Схема RealFbs
              </h3>
              <p className="text-gray-600">
                Работаем только по схеме RealFbs без движения товара
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Доходимость 95%
              </h3>
              <p className="text-gray-600">
                Из 100 выкупов придут 95 отзывов - гарантированный результат
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Zap" size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Скорость работы
              </h3>
              <p className="text-gray-600">
                Быстрое выполнение заказов и оперативная обратная связь
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="TrendingUp" size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Большие объемы
              </h3>
              <p className="text-gray-600">
                Можем выкупать до 7000 единиц в день
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-r from-blue-600 to-green-500"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Свяжитесь с нами для консультации и расчета стоимости услуг
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold"
              onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Связаться с менеджером
            </Button>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
            <div>
              <Icon
                name="MessageCircle"
                size={24}
                className="mx-auto text-blue-100 mb-2"
              />
              <div className="text-white font-semibold">Telegram</div>
              <div className="text-blue-100">@cupozon_mp</div>
            </div>
            <div>
              <Icon
                name="Clock"
                size={24}
                className="mx-auto text-blue-100 mb-2"
              />
              <div className="text-white font-semibold">Время работы</div>
              <div className="text-blue-100">24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingCart" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">CUPOZON</span>
              </div>
              <p className="text-gray-400 mb-4">
                Профессиональные услуги продвижения товаров на маркетплейсе
                Озон. Увеличиваем рейтинг, улучшаем позиции в поиске.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Самовыкупы товаров</li>
                <li>Накрутка отзывов</li>
                <li>SEO оптимизация</li>
                <li>Консультации</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Telegram: @cupozon_mp</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CUPOZON. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
