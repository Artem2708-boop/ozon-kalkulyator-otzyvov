import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

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
              <Icon name="Rocket" size={32} className="text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Добро пожаловать в CUPOZON!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600">
            Профессиональное продвижение товаров на маркетплейсах Ozon и Wildberries
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <Icon name="Star" size={20} className="text-yellow-500 mr-2" />
              Наши преимущества:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Рост продаж от 200% за 3 месяца
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Безопасные схемы работы
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-green-500 mr-2" />
                Более 3 лет опыта
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
