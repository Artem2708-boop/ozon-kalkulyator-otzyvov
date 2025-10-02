import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const FreeTrialPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTrialPopup = sessionStorage.getItem("hasSeenFreeTrialPopup");
    
    if (!hasSeenTrialPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 90000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenFreeTrialPopup", "true");
  };

  const handleContact = () => {
    window.open("https://t.me/cupozon_mp", "_blank");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="Gift" size={40} className="text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl lg:text-3xl">
            Всё ещё сомневаетесь?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <Icon name="Sparkles" size={28} className="text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Специальное предложение!
                </h3>
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                5 самовыкупов БЕСПЛАТНО
              </div>
              <p className="text-gray-600 text-sm">
                на ваш товар прямо сейчас
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-center">
                <Icon name="CheckCircle" className="text-green-500 mr-2" size={20} />
                Что входит:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <Icon name="Check" size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>5 реальных самовыкупов</strong> с отзывами</span>
                </li>
                <li className="flex items-start">
                  <Icon name="Check" size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Без подводных камней</strong> и скрытых платежей</span>
                </li>
                <li className="flex items-start">
                  <Icon name="Check" size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Без лишних условий</strong> — просто попробуйте</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-center text-sm text-gray-700">
                <strong>С вас только бюджет товара</strong><br/>
                Услуги по самовыкупу — <span className="text-blue-600 font-bold">БЕСПЛАТНО!</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContact}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg font-bold"
            >
              <Icon name="MessageCircle" size={24} className="mr-2" />
              Получить 5 бесплатных самовыкупов
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              Может позже
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Предложение ограничено • Только для новых клиентов
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialPopup;
