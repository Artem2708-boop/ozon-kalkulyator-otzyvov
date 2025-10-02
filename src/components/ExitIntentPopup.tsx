import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenExitPopup = sessionStorage.getItem("hasSeenExitPopup");
    
    if (hasSeenExitPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenExitPopup) {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenExitPopup", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContact = () => {
    window.open("https://t.me/cupozon_mp", "_blank");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Icon name="AlertCircle" size={48} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xl">❗</span>
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-3xl text-red-600">
            Подождите! Не уходите!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="text-center">
            <p className="text-xl text-gray-700 font-semibold mb-2">
              Вы упускаете возможность увеличить продажи!
            </p>
            <p className="text-gray-600">
              Тысячи продавцов уже зарабатывают больше благодаря нашим самовыкупам
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-300">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🔥 ПОСЛЕДНИЙ ШАНС
              </h3>
              <div className="text-3xl font-bold text-red-600 mb-3">
                Скидка 20% на первый заказ
              </div>
              <p className="text-sm text-gray-600">
                Только для тех, кто обратится прямо сейчас
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-3 text-center">
                Что вы получите:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Icon name="TrendingUp" className="text-green-500 mr-2" size={18} />
                  <span>Рост продаж на 200%</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Shield" className="text-green-500 mr-2" size={18} />
                  <span>Защита от штрафов</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Star" className="text-green-500 mr-2" size={18} />
                  <span>Реальные отзывы</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Zap" className="text-green-500 mr-2" size={18} />
                  <span>Быстрый результат</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300 text-center">
              <p className="text-sm font-semibold text-gray-800">
                ⏰ Предложение действует только сегодня
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContact}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-6 text-lg font-bold shadow-xl"
            >
              <Icon name="Gift" size={24} className="mr-2" />
              Получить скидку 20%
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Нет, я передумал зарабатывать больше
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-xs text-gray-600">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10000+</div>
              <div className="text-xs text-gray-600">Успешных выкупов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3+ года</div>
              <div className="text-xs text-gray-600">На рынке</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
