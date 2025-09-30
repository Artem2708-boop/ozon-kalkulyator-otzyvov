import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Management = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Icon name="ShoppingCart" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                CUPOZON
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Главная
              </a>
              <a
                onClick={() => navigate('/management')}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Ведение магазина
              </a>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
            >
              Связаться
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-6 text-lg px-6 py-2">
              Профессиональное управление
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ведение вашего магазина
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                {" "}
                на маркетплейсе
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Доверьте управление вашим магазином на Ozon и Wildberries профессионалам. 
              Мы возьмем на себя все задачи по продвижению и развитию вашего бизнеса.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-12 py-6 text-lg font-semibold"
              onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
            >
              <Icon name="MessageCircle" size={24} className="mr-3" />
              Обсудить ведение магазина
            </Button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Что входит в ведение магазина
            </h2>
            <p className="text-xl text-gray-600">
              Комплексный подход к управлению вашим бизнесом
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Search" size={32} className="text-blue-600" />
                </div>
                <CardTitle>SEO и оптимизация</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Регулярная оптимизация карточек</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Анализ конкурентов</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Работа с ключевыми словами</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Улучшение позиций в поиске</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Star" size={32} className="text-green-600" />
                </div>
                <CardTitle>Управление отзывами</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Накрутка положительных отзывов</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Работа с негативом</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Поддержка высокого рейтинга</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Регулярный мониторинг</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" size={32} className="text-purple-600" />
                </div>
                <CardTitle>Самовыкупы и продвижение</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Регулярные самовыкупы по RealFbs</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Рост позиций в выдаче</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Увеличение продаж</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Безопасные схемы работы</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="BarChart" size={32} className="text-orange-600" />
                </div>
                <CardTitle>Аналитика и отчетность</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Еженедельные отчеты</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Анализ эффективности</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Рекомендации по развитию</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Прозрачность всех действий</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Megaphone" size={32} className="text-red-600" />
                </div>
                <CardTitle>Настройка рекламы</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Создание рекламных кампаний</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Оптимизация бюджетов</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>А/Б тестирование</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Снижение стоимости клика</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Headphones" size={32} className="text-teal-600" />
                </div>
                <CardTitle>Поддержка 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Персональный менеджер</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Быстрые ответы на вопросы</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Консультации по стратегии</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Check" className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Решение любых вопросов</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Почему стоит доверить ведение магазина нам
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Экономия времени</h3>
              <p className="text-gray-600">
                Вы фокусируетесь на товаре, мы — на продвижении
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Экспертиза</h3>
              <p className="text-gray-600">
                3 года опыта работы с маркетплейсами
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="TrendingUp" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Рост продаж</h3>
              <p className="text-gray-600">
                В среднем рост на 200-400% за 3 месяца
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Безопасность</h3>
              <p className="text-gray-600">
                Только проверенные схемы без блокировок
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Тарифы на ведение магазина
            </h2>
            <p className="text-xl text-gray-600">
              Выберите подходящий формат сотрудничества
            </p>
          </div>

          <Card className="bg-gradient-to-br from-blue-600 to-green-500 text-white shadow-2xl border-0">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <Badge className="bg-white text-blue-600 mb-4 text-sm font-bold px-4 py-1">
                  ИНДИВИДУАЛЬНЫЙ ПОДХОД
                </Badge>
                <h3 className="text-3xl font-bold mb-4">
                  Стоимость рассчитывается индивидуально
                </h3>
                <p className="text-lg opacity-90 mb-6">
                  Цена зависит от количества товаров, целей и необходимых услуг
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/20 rounded-lg p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Icon name="Package" size={24} className="mr-2" />
                    Что влияет на стоимость:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Количество товаров в магазине</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Текущее состояние карточек</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Необходимый объем работ</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Бюджет на рекламу и выкупы</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/20 rounded-lg p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <Icon name="Sparkles" size={24} className="mr-2" />
                    Форматы работы:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Ежемесячный абонемент</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Разовые проекты</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>% от оборота</span>
                    </li>
                    <li className="flex items-start">
                      <Icon name="Check" className="mr-2 mt-1 flex-shrink-0" size={16} />
                      <span>Комбинированные схемы</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg font-bold"
                  onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
                >
                  <Icon name="MessageCircle" size={24} className="mr-3" />
                  Получить расчет стоимости
                </Button>
                <p className="text-sm opacity-90 mt-4">
                  Бесплатная консультация • Расчет за 24 часа • Гибкие условия
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Готовы передать ведение магазина профессионалам?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Напишите нам в Telegram для бесплатной консультации и расчета стоимости
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg font-semibold"
            onClick={() => window.open("https://t.me/cupozon_mp", "_blank")}
          >
            <Icon name="Send" size={24} className="mr-3" />
            Написать в Telegram
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Icon name="ShoppingCart" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">CUPOZON</span>
            </div>
            <p className="text-gray-400 mb-4">
              Профессиональное ведение магазинов на Ozon и Wildberries
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">&copy; 2024 CUPOZON. Все права защищены.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Management;