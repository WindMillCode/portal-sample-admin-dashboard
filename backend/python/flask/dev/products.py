from __main__ import app,db,ma,request,pprint,json,my_util,users,sqlalchemy
from users import User
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text as sa_text
import uuid
from my_util import GUID

class Product(db.Model):
    productId = db.Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable = False)
    img_url = db.Column(db.String(1000))
    price = db.Column(db.Float, nullable = False)
    quantity = db.Column(db.Integer, nullable = False)

    desc = db.Column(db.String(3000), nullable = True)
    img_data = db.Column(db.LargeBinary,nullable = True) # I rather just use a storage service and place the url here

    def __init__(self,title,img_url,price,quantity,desc,img_data):
        self.title = title
        self.img_url = img_url
        self.price = price
        self.quantity = quantity
        self.desc = desc
        self.img_data = img_data


    def  any(self):
        return '<'

class ProductSchema(ma.Schema):
    class Meta:
        fields = ('title','img_url','price','quantity','desc','img_data')

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

@app.route('/product/create',methods=['PUT'])
def create_product():
    None

@app.route('/product/read',methods=['POST'])
def read_product():
    None




@app.route('/product/update',methods=['PATCH'])
def update_product():
    None




@app.route('/product/delete',methods=['DELETE'])
def delete_product():
    None

@app.route('/product/list',methods=['POST'])
def list_products():
    None

