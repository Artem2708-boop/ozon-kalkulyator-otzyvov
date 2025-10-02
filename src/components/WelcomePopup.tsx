import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };

  const handleContact = () => {
    window.open("https://t.me/cupozon_mp", "_blank");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
              <Icon name="Gift" size={32} className="text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Получите уникальное предложение!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border-2 border-red-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Clock" size={20} className="text-red-600" />
              <p className="text-sm text-gray-600">Предложение действует:</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 tabular-nums">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
            <div className="flex items-center justify-center mb-3">
              <Icon name="Sparkles" size={24} className="text-yellow-600 mr-2" />
              <h3 className="font-bold text-lg text-gray-900">
                Специальный бонус
              </h3>
            </div>
            <p className="text-center text-gray-700 font-semibold text-lg mb-2">
              5 отзывов в подарок
            </p>
            <p className="text-center text-gray-600 text-sm">
              при заказе через сайт прямо сейчас
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">
              Что вы получаете:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Безопасные самовыкупы с гарантией
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Рост продаж от 200% за 3 месяца
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Более 10000 реальных аккаунтов
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContact}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white"
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Написать в Telegram
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              Посмотреть сайт
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;