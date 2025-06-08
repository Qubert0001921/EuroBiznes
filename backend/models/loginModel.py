
class LoginModel():
    def __init__(self):
        self.name = ""
        self.id: str = 0
    
    @staticmethod
    def loginModelToJson(obj):
        if isinstance(obj, LoginModel):
            return {
                "name": obj.name,
                "id": obj.id
            }
        raise TypeError