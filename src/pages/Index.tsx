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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sendEmail, initEmailJS } from "@/utils/emailService";
import WelcomePopup from "@/components/WelcomePopup";

const Index = () => {
  const [totalReviews, setTotalReviews] = useState("");
  const [reviews5, setReviews5] = useState("");
  const [reviews4, setReviews4] = useState("");
  const [reviews3, setReviews3] = useState("");
  const [reviews2, setReviews2] = useState("");
  const [reviews1, setReviews1] = useState("");
  const [results, setResults] = useState<{ 
    rating: number; 
    needed: number; 
    pricePerReview?: number; 
    totalCost?: number; 
    isBestValue?: boolean; 
  }[]>([]);

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
          
          let needed;
          
          if (Math.abs(targetRating - 5.0) < 0.01) {
            // Для достижения 5.0 звезд: все отзывы должны быть 5-звездочными
            // Поэтому нужно добавить столько 5-звездочных, чтобы они "перевесили" все остальные
            const badReviews = r4 + r3 + r2 + r1;
            if (badReviews === 0) {
              needed = 0; // Уже 5.0 звезд
            } else {
              // Практически для 5.0 нужно очень много отзывов
              // Используем приближение к 4.99
              const numerator = 4.99 * total - currentTotalScore;
              const denominator = 5 - 4.99;
              needed = Math.ceil(numerator / denominator);
            }
          } else {
            // Обычная формула для рейтингов 4.5-4.9
            const numerator = targetRating * total - currentTotalScore;
            const denominator = 5 - targetRating;
            needed = Math.ceil(numerator / denominator);
          }

          if (needed >= 0) {
            // Расчет стоимости в зависимости от количества
            let pricePerReview = 250; // Базовая цена
            if (needed >= 51 && needed <= 200) {
              pricePerReview = 150;
            } else if (needed >= 201 && needed <= 500) {
              pricePerReview = 120;
            } else if (needed >= 501 && needed <= 1000) {
              pricePerReview = 100;
            } else if (needed >= 1001 && needed <= 2000) {
              pricePerReview = 80;
            } else if (needed > 2000) {
              pricePerReview = 60;
            }
            
            const totalCost = needed * pricePerReview;
            
            calculatedResults.push({
              rating: Math.round(targetRating * 10) / 10,
              needed: needed,
              pricePerReview: pricePerReview,
              totalCost: totalCost,
            });
          }
        }
      }

      // Находим самый выгодный вариант (лучшее соотношение цена/качество)
      // Это будет вариант с минимальной стоимостью за 0.1 звезды
      if (calculatedResults.length > 0) {
        let bestValueIndex = 0;
        let bestValueRatio = Infinity;
        
        calculatedResults.forEach((result, index) => {
          const ratingGain = result.rating - currentRating;
          const valueRatio = result.totalCost / ratingGain;
          if (valueRatio < bestValueRatio) {
            bestValueRatio = valueRatio;
            bestValueIndex = index;
          }
        });
        
        calculatedResults[bestValueIndex].isBestValue = true;
      }

      setResults(calculatedResults);
    } else {
      // Показываем сообщение об ошибке
      alert("Пожалуйста, проверьте введенные данные. Сумма отзывов по звездам должна равняться общему количеству отзывов.");
      setResults([]);
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
      <WelcomePopup />
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
                href="#services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Услуги
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
                Безопасные самовыкупы на OZON
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Безопасный самовыкуп на OZON{" "}
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  с гарантией защиты от штрафов
                </span>
              </h1>
              <div className="space-y-3 mb-8">
                <p className="text-lg text-gray-600 flex items-start">
                  <Icon name="Check" className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Более 10000 реальных аккаунтов с ПВЗ</span>
                </p>
                <p className="text-lg text-gray-600 flex items-start">
                  <Icon name="Check" className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Полная имитация поведения живых покупателей</span>
                </p>
                <p className="text-lg text-gray-600 flex items-start">
                  <Icon name="Check" className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Уникальные методы оплаты для каждого выкупа</span>
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-14 py-7 text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  onClick={() =>
                    document
                      .getElementById("calculator")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="Calculator" size={28} className="mr-3" />
                  Рассчитать отзывы
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-14 py-7 text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="ShoppingCart" size={28} className="mr-3" />
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

      {/* Services Tabs Section */}
      <section
        id="services"
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Наши услуги
            </h2>
            <p className="text-xl text-gray-600">
              Полный спектр услуг для продвижения товаров на Озон
            </p>
          </div>

          <Tabs defaultValue="samovykupy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="samovykupy">Самовыкупы</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              <TabsTrigger value="seo">SEO оптимизация</TabsTrigger>
              <TabsTrigger value="consulting">Консультации</TabsTrigger>
            </TabsList>

            <TabsContent value="samovykupy" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Самовыкупы товаров по схеме RealFbs
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Профессиональные самовыкупы без движения товара. Увеличиваем 
                    количество продаж и улучшаем позиции в поиске Озон.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-green-500 mr-2" size={20} />
                      Доходимость 95%
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-green-500 mr-2" size={20} />
                      До 7000 выкупов в день
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-green-500 mr-2" size={20} />
                      Работа без движения товара
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-green-500 mr-2" size={20} />
                      Безопасная схема RealFbs
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-4">Результат самовыкупов:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Рост продаж:</span>
                      <span className="font-bold text-green-600">+300-500%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Улучшение позиций:</span>
                      <span className="font-bold text-blue-600">в ТОП-10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Время результата:</span>
                      <span className="font-bold text-orange-600">3-7 дней</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Накрутка отзывов на Озон
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Качественные отзывы от реальных аккаунтов с историей покупок.
                    Повышаем рейтинг товара и доверие покупателей.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Icon name="Star" className="text-yellow-500 mr-2" size={20} />
                      Отзывы с фото и видео
                    </li>
                    <li className="flex items-center">
                      <Icon name="Star" className="text-yellow-500 mr-2" size={20} />
                      Аккаунты с историей покупок
                    </li>
                    <li className="flex items-center">
                      <Icon name="Star" className="text-yellow-500 mr-2" size={20} />
                      Детальные развернутые отзывы
                    </li>
                    <li className="flex items-center">
                      <Icon name="Star" className="text-yellow-500 mr-2" size={20} />
                      Постепенное размещение
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-4">Повышение рейтинга:</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>3.5 → 4.5 звезд:</span>
                      <span className="font-bold text-green-600">15-20 отзывов</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>4.0 → 4.7 звезд:</span>
                      <span className="font-bold text-green-600">25-30 отзывов</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>4.5 → 4.9 звезд:</span>
                      <span className="font-bold text-green-600">40-50 отзывов</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    SEO оптимизация товара для роста позиций
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Комплексная оптимизация карточки товара для улучшения видимости
                    в поиске Озон и увеличения органического трафика.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Icon name="Search" className="text-blue-500 mr-2" size={20} />
                      Анализ ключевых слов конкурентов
                    </li>
                    <li className="flex items-center">
                      <Icon name="Search" className="text-blue-500 mr-2" size={20} />
                      Оптимизация названия и описания
                    </li>
                    <li className="flex items-center">
                      <Icon name="Search" className="text-blue-500 mr-2" size={20} />
                      Подбор высокочастотных запросов
                    </li>
                    <li className="flex items-center">
                      <Icon name="Search" className="text-blue-500 mr-2" size={20} />
                      Настройка характеристик товара
                    </li>
                    <li className="flex items-center">
                      <Icon name="Search" className="text-blue-500 mr-2" size={20} />
                      Оптимизация изображений
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-4">Результаты SEO оптимизации:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Позиции в поиске:</span>
                      <span className="font-bold text-blue-600">ТОП-20 → ТОП-5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Органический трафик:</span>
                      <span className="font-bold text-green-600">+200-400%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Конверсия в продажи:</span>
                      <span className="font-bold text-orange-600">+150-250%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Время результата:</span>
                      <span className="font-bold text-purple-600">7-14 дней</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="consulting" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Консультации по маркетплейсу Озон
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Персональные консультации от экспертов маркетплейса Озон.
                    Поможем разобраться в тонкостях продвижения и избежать блокировок.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Icon name="MessageCircle" className="text-green-500 mr-2" size={20} />
                      Аудит текущей стратегии продвижения
                    </li>
                    <li className="flex items-center">
                      <Icon name="MessageCircle" className="text-green-500 mr-2" size={20} />
                      Анализ конкурентов и ниши
                    </li>
                    <li className="flex items-center">
                      <Icon name="MessageCircle" className="text-green-500 mr-2" size={20} />
                      Составление плана продвижения
                    </li>
                    <li className="flex items-center">
                      <Icon name="MessageCircle" className="text-green-500 mr-2" size={20} />
                      Помощь в настройке рекламы
                    </li>
                    <li className="flex items-center">
                      <Icon name="MessageCircle" className="text-green-500 mr-2" size={20} />
                      Обучение работе с аналитикой
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-4">Форматы консультаций:</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-bold">Экспресс-консультация</h5>
                      <p className="text-sm text-gray-600">30 мин • 2000 ₽</p>
                      <p className="text-sm">Быстрые ответы на вопросы</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-bold">Полный аудит</h5>
                      <p className="text-sm text-gray-600">2 часа • 8000 ₽</p>
                      <p className="text-sm">Детальный разбор + рекомендации</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-bold">Месячное сопровождение</h5>
                      <p className="text-sm text-gray-600">Неограниченно • 25000 ₽</p>
                      <p className="text-sm">Постоянная поддержка + стратегия</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
                  <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`relative p-6 rounded-lg border-2 ${
                          result.isBestValue
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-300 shadow-lg"
                            : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                        }`}
                      >
                        {result.isBestValue && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-orange-500 text-white px-3 py-1 text-xs font-bold">
                              ВЫГОДНО
                            </Badge>
                          </div>
                        )}
                        
                        <div className="text-center space-y-3">
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            {result.rating.toFixed(1)} ⭐
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-lg font-semibold text-blue-600">
                              {result.needed} отзывов
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.pricePerReview} ₽ за отзыв
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              {result.totalCost.toLocaleString()} ₽
                            </div>
                          </div>
                          
                          <Button
                            className={`w-full mt-4 ${
                              result.isBestValue
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-500 hover:bg-green-600"
                            } text-white font-semibold`}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                reviewCount: result.needed.toString()
                              }));
                              document
                                .getElementById("contact-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            <Icon name="ShoppingCart" size={16} className="mr-2" />
                            Заказать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              Реальные кейсы
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Примеры наших работ
            </h2>
            <p className="text-xl text-gray-600">
              Как мы помогли продавцам выйти в ТОП
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/c61aef13-7b5b-4baa-bc5d-d70aadbd7a1f.jpg"
                  alt="Женское худи"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Женское худи</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 10 страницы → ТОП 10
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>7 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>70 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">10 500 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/c3b35aec-4828-4105-be64-d8cb9970cbc9.jpg"
                  alt="Беспроводные наушники"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Беспроводные наушники</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 15 страницы → ТОП 5
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>10 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>120 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">18 000 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/6d858fbb-ea63-4518-8995-6f2bca144247.jpg"
                  alt="Кожаный кошелек"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Кожаный кошелек</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 8 страницы → ТОП 3
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>5 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>50 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">7 500 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/e6b978dd-6098-43a5-8c90-7754f4c62c26.jpg"
                  alt="Спортивная бутылка"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Спортивная бутылка</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 12 страницы → ТОП 7
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>6 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>60 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">9 000 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/e844273c-8e60-4e2b-899f-96403f13bd55.jpg"
                  alt="Чехол для телефона"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Чехол для телефона</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 20 страницы → ТОП 15
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>8 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>80 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">12 000 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/a558d1b1-87a3-4702-9977-aaa9881fb132.jpg"
                  alt="Детский рюкзак"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Детский рюкзак</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 7 страницы → ТОП 5
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>9 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>90 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">13 500 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/60477d8f-ae31-4605-b7a4-769da498dfd5.jpg"
                  alt="Настольная лампа"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Настольная лампа</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 9 страницы → ТОП 6
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>7 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>65 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">9 750 ₽</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="/img/1671aaf5-98c3-4250-a73c-471224849d53.jpg"
                  alt="Набор ножей"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">Набор ножей</h3>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    С 11 страницы → ТОП 4
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li className="flex items-center">
                    <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
                    <span>12 дней на самовыкупы</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="ShoppingCart" size={14} className="text-blue-500 mr-2" />
                    <span>100 самовыкупов</span>
                  </li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Бюджет:</p>
                  <p className="text-xl font-bold text-blue-600">15 000 ₽</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-12 py-6 text-lg font-semibold"
              onClick={() =>
                document
                  .getElementById("contact-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Icon name="Rocket" size={24} className="mr-3" />
              Хочу такой же результат
            </Button>
          </div>
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

      {/* SEO Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Цены на SEO оптимизацию
            </h2>
            <p className="text-xl text-gray-600">
              Профессиональная оптимизация карточек товаров для роста в поиске
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileText" size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Одна карточка
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    3000 ₽
                  </div>
                  <p className="text-gray-600 mb-6">
                    Полная оптимизация одной карточки товара
                  </p>
                  <ul className="space-y-3 text-left mb-6">
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Анализ конкурентов</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Подбор ключевых слов</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Оптимизация текстов</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Настройка характеристик</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      document
                        .getElementById("contact-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Заказать
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-xl border-0 hover:shadow-2xl transition-shadow transform scale-105">
              <CardContent className="p-8">
                <div className="text-center">
                  <Badge className="bg-white text-green-600 mb-4 text-xs font-bold">
                    ВЫГОДНО
                  </Badge>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Package" size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Пакет 5 карточек
                  </h3>
                  <div className="text-4xl font-bold mb-2">
                    12 000 ₽
                  </div>
                  <div className="text-sm opacity-90 mb-4">
                    2400 ₽ за карточку • Экономия 3000 ₽
                  </div>
                  <p className="opacity-90 mb-6">
                    Оптимизация пяти товаров по выгодной цене
                  </p>
                  <ul className="space-y-3 text-left mb-6">
                    <li className="flex items-start">
                      <Icon name="Check" className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                      <span>Все из базового пакета</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                      <span>Приоритетная обработка</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                      <span>Консультация по продвижению</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-white mr-2 mt-1 flex-shrink-0" size={20} />
                      <span>Отчет по каждой карточке</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-white text-green-600 hover:bg-gray-100"
                    onClick={() =>
                      document
                        .getElementById("contact-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Заказать пакет
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Zap" size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    10+ карточек
                  </h3>
                  <div className="text-4xl font-bold text-purple-600 mb-4">
                    2000 ₽
                  </div>
                  <p className="text-gray-600 mb-6">
                    Оптовая цена за каждую карточку при заказе от 10 штук
                  </p>
                  <ul className="space-y-3 text-left mb-6">
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Максимальная экономия</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Персональный менеджер</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Индивидуальная стратегия</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Полный аудит ниши</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() =>
                      document
                        .getElementById("contact-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Обсудить проект
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Package */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <CardContent className="p-10 relative z-10">
                <div className="text-center mb-8">
                  <Badge className="bg-white text-orange-600 mb-4 text-sm font-bold px-4 py-1">
                    🔥 ПРЕМИУМ ПАКЕТ
                  </Badge>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-3">
                    Карточка под ключ
                  </h3>
                  <div className="text-5xl font-bold mb-2">
                    23 000 ₽
                  </div>
                  <p className="text-lg opacity-90 mb-6">
                    Полностью готовая карточка для старта продаж на Ozon или Wildberries
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4 flex items-center">
                      <Icon name="Sparkles" size={24} className="mr-2" />
                      Что входит в пакет:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Icon name="CheckCircle" className="mr-3 mt-1 flex-shrink-0" size={20} />
                        <span><strong>Анализ ключевых слов</strong> и проработка SEO</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="CheckCircle" className="mr-3 mt-1 flex-shrink-0" size={20} />
                        <span><strong>Написание ТЗ</strong> для дизайнера</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="CheckCircle" className="mr-3 mt-1 flex-shrink-0" size={20} />
                        <span><strong>Работа дизайнера</strong> (6 слайдов входит в стоимость)</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="CheckCircle" className="mr-3 mt-1 flex-shrink-0" size={20} />
                        <span><strong>30 отзывов с оценкой 5 звезд</strong> на карточке</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-4 flex items-center">
                      <Icon name="Gift" size={24} className="mr-2" />
                      Результат:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Icon name="Star" className="mr-3 mt-1 flex-shrink-0 fill-current" size={20} />
                        <span>Готовая карточка с высоким рейтингом</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Star" className="mr-3 mt-1 flex-shrink-0 fill-current" size={20} />
                        <span>Профессиональный дизайн товара</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Star" className="mr-3 mt-1 flex-shrink-0 fill-current" size={20} />
                        <span>Оптимизация под поиск маркетплейса</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Star" className="mr-3 mt-1 flex-shrink-0 fill-current" size={20} />
                        <span>Можно сразу начинать продажи</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-center">
                    <Icon name="Info" size={16} className="inline mr-2" />
                    Расчет необходимого количества отзывов производится индивидуально. 
                    30 отзывов входят в пакет, дополнительные отзывы по стандартному тарифу.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-6 text-lg font-bold"
                    onClick={() =>
                      document
                        .getElementById("contact-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Icon name="ShoppingCart" size={24} className="mr-3" />
                    Заказать премиум пакет
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-green-500 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <img
                      src="https://cdn.poehali.dev/files/d657736a-6b4d-4cce-9598-3577e87a0f8c.jpg"
                      alt="Артем Асриев"
                      className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Icon name="Award" size={32} className="text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Артем Асриев
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Основатель CUPOZON
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 p-8 lg:p-12">
                <div className="mb-6">
                  <Icon name="Quote" size={40} className="text-blue-600 opacity-50 mb-4" />
                  <blockquote className="text-xl lg:text-2xl font-semibold text-gray-800 italic mb-6">
                    "Отзывы — это не просто цифры, это мост доверия между продавцом и покупателем"
                  </blockquote>
                </div>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Я сам являюсь <span className="font-semibold text-gray-900">действующим селлером</span> на маркетплейсах, 
                    поэтому точно знаю, как работают самовыкупы и какую реальную пользу они приносят бизнесу.
                  </p>
                  
                  <p>
                    За годы работы я понял: <span className="font-semibold text-gray-900">отзывы дают большую конверсию в заказ и продажи</span>, 
                    чем любой другой инструмент продвижения. Это главный фактор принятия решения о покупке.
                  </p>
                  
                  <p>
                    При наличии <span className="font-semibold text-gray-900">грамотных отзывов</span> мы можем объяснить покупателю 
                    качество и преимущества товара так, как не сможет ни одно описание или фото. Именно поэтому я создал CUPOZON — 
                    сервис, который помогает селлерам получить эти критически важные отзывы безопасно и эффективно.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={20} />
                      <span className="text-sm text-gray-600">3+ года на маркетплейсах</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={20} />
                      <span className="text-sm text-gray-600">Действующий селлер</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={20} />
                      <span className="text-sm text-gray-600">500+ успешных кейсов</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white w-full sm:w-auto"
                    onClick={() => window.open("http://t.me/artemasriev777", "_blank")}
                  >
                    <Icon name="Send" size={20} className="mr-2" />
                    Связаться с основателем
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Managers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              Личная поддержка
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ваши помощники 24/7
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Менеджеры, которые считают и помогают выкупать ваши товары, а не роботы или онлайн-сайты где вы оставляете заявку
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <div className="flex items-center gap-6">
                    <img
                      src="/img/81459f98-e624-4f00-984a-c8c4d732e078.jpg"
                      alt="Менеджер Татьяна"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-1">Татьяна</h3>
                      <p className="text-purple-100">Старший менеджер</p>
                      <div className="flex items-center mt-2">
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <Icon name="Quote" size={32} className="text-purple-500 opacity-50 mb-3" />
                    <blockquote className="text-gray-700 italic leading-relaxed">
                      "Самовыкупы — это отдельный мир, где мы являемся проводниками. 
                      Моя цель, чтобы у вас всё получилось, и я помогу вам на каждом этапе"
                    </blockquote>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Персональное сопровождение</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Помощь в расчетах и стратегии</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Ответы 24/7</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    size="lg"
                    onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
                  >
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Связаться с Татьяной
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                  <div className="flex items-center gap-6">
                    <img
                      src="/img/cba606ad-c9f8-4dce-a1ce-9c97f2dbb5b8.jpg"
                      alt="Менеджер Артур"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-1">Артур</h3>
                      <p className="text-blue-100">Менеджер по работе с клиентами</p>
                      <div className="flex items-center mt-2">
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300 mr-1" />
                        <Icon name="Star" size={16} className="text-yellow-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <Icon name="Quote" size={32} className="text-blue-500 opacity-50 mb-3" />
                    <blockquote className="text-gray-700 italic leading-relaxed">
                      "Каждый клиент уникален, и я подбираю индивидуальную стратегию продвижения. 
                      Вместе мы достигнем ваших целей на маркетплейсах"
                    </blockquote>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Индивидуальный подход</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Консультации по продвижению</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Icon name="CheckCircle" className="text-green-500 mr-2" size={16} />
                      <span>Быстрая обратная связь</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    size="lg"
                    onClick={() => window.open("https://t.me/cupozon_mpartur", "_blank")}
                  >
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Связаться с Артуром
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-green-50 rounded-full px-6 py-3">
              <Icon name="Users" className="text-green-600" size={24} />
              <p className="text-green-800 font-semibold">
                Живые люди, а не боты — вот что отличает нас от конкурентов
              </p>
            </div>
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
              Связаться с нами для заказа
            </h2>
            <p className="text-xl text-gray-600">
              Напишите нам в Telegram для обсуждения деталей заказа
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Send" size={40} className="text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Готовы начать работу?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Свяжитесь с нами в Telegram для быстрой консультации и оформления заказа
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg font-semibold"
                  onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
                >
                  <Icon name="Send" size={24} className="mr-3" />
                  Написать нам в Telegram
                </Button>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Отвечаем быстро • Работаем 24/7 • Консультация бесплатно
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingCart" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">CUPOZON</span>
              </div>
              <p className="text-gray-400 mb-4">Одни из лидеров по количеству подписчиков в Telegram по выкупам. Профессиональные услуги продвижения товаров на маркетплейсе Озон.

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
              <h3 className="font-semibold mb-4">Сотрудничаем с</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Бренды:</h4>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>• vshell</li>
                    <li>• wetnose</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Клубы:</h4>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>• Mpseller</li>
                    <li className="text-xs text-gray-500">
                      (сотрудничаем только с резидентами)
                    </li>
                  </ul>
                </div>
              </div>
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