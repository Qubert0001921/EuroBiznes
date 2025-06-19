
class LoginModel():
    def __init__(self,id, name="", money=3000):
        self.name = name
        self.id: str = id
        self.money: int = money
    
    @staticmethod
    def loginModelToJson(obj):
        if isinstance(obj, LoginModel):
            return {
                "name": obj.name,
                "id": obj.id,
                "money": obj.money
            }
        raise TypeError