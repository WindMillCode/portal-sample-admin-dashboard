from __main__ import app,db,ma,request,pprint,json,my_util
from my_util import GUID


class User(db.Model):
    user = db.Column(db.String(200), primary_key=True)
    myPass = db.Column(db.String(200),unique=True, nullable=False)
    billing = db.Column(db.String(20000))
    shipping = db.Column(db.String(2000))
    shipping_same_as_billing = db.Column(db.Boolean)
    cartId = db.Column(GUID(), nullable=True)

    def __init__ (self, user, myPass, billing, shipping, shipping_same_as_billing):
        self.user = user
        self.myPass = myPass
        self.billing = billing
        self.shipping = shipping
        self.shipping_same_as_billing = shipping_same_as_billing


    def any(self):
        return '<user user = {} ,myPass ={}, billing={}, shipping={}, shipping_same_as_billing={},>'.format(self.user, self.myPass, self.billing, self.shipping, self.shipping_same_as_billing)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('user', 'myPass','billing', 'shipping', 'shipping_same_as_billing')

user_schema = UserSchema()
users_schema = UserSchema(many=True)




@app.route('/users/create',methods=['PUT'])
def create_user():
    data = request.json['data']
    newUser = User(
        data['user'],
        data['pass'],
        json.dumps(data['billing']),
        json.dumps(data['shipping']),
        data['shipping']['sameAsBilling']['checked']
    )
    db.session.add(newUser)
    db.session.commit()
    return {
        'message':{'message':'CREATED'},

    },201



@app.route('/users/read',methods=['POST'])
def read_user():
    data = request.json['data']
    user =   data['user']
    mYpass = data['pass']
    user = User.query.filter_by(user=user).first()
    if user is None:
        return {
            'message':{'message':'User not found'},

        },404
    elif user.myPass == mYpass:
        user.billing = json.loads(user.billing)
        user.shipping = json.loads(user.shipping)
        return {
            'message':{
                'message':'OK',
                'data':user_schema.dump(user)
            },

        },200


@app.route('/users/update',methods=['PATCH'])
def update_user():
    # needs authentication before update
    data = request.json["data"]
    user = data['user']
    update_body = data['update_body']
    update_user_class = User.query.filter_by(user=user).first()
    pprint.pprint(update_user_class)
    if update_user_class is None:
        return {
            'message':{'message':'User not found'},
        },404
    user_to_update = user_schema.dump(update_user_class)
    user_to_update["billing"] =  json.loads(user_to_update["billing"])
    user_to_update["shipping"] = json.loads(user_to_update["shipping"])



    user_to_update =  my_util.update_target(user_to_update,update_body)



    update_user_class.user = user_to_update["user"]
    update_user_class.myPass = user_to_update["myPass"]
    update_user_class.billing = json.dumps(user_to_update["billing"])
    update_user_class.shipping = json.dumps(user_to_update["shipping"])
    update_user_class.shipping_same_as_billing = user_to_update["shipping_same_as_billing"]

    db.session.flush()
    db.session.commit()
    return {
        'message':{
            'target':user_to_update
        },

    },200


@app.route('/users/delete',methods=['DELETE'])
def delete_user():
    data = request.json['data']
    user = User.query.filter_by(user=data['user']).first()
    db.session.delete(user)
    db.session.commit()
    return {
        'message':{'message':'DELETED'},
    },200


@app.route('/users/list',methods=['POST'])
def list_users():
    # if admin requests then supply, you dont want this on the backend

    users = User.query.all()
    users = [ {
        'user':x.user,
        'myPass':x.myPass,
        'billing':json.loads(x.billing),
        'shipping':json.loads(x.shipping),
    } for x in users]
    return users_schema.jsonify(users),200
