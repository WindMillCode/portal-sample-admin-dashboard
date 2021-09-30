import sys
if sys.platform == "win32":
    sys.path.append(sys.path[0] + "\\site-packages\\windows")
elif sys.platform =="linux":
    sys.path.append(sys.path[0] + "/site-packages/linux")
from flask import Flask, request, redirect
import os
from flask_sqlalchemy import SQLAlchemy


# dev additions
import pprint
import requests
import mimetypes
from flask_socketio import SocketIO
#

app = Flask(__name__)
PORT = os.environ.get("PORT")
PORT = PORT if PORT else 3005
app.config.update(
    # SERVER_NAME="127.0.0.1:{}".format(PORT),
    FLASK_ENV = 'production',
    SECRET_KEY=os.environ.get("FLASK_SOCKET_IO_SECRET_KEY")
)
sio = SocketIO(app,cors_allowed_origins=os.environ.get('FRONTEND_ORIGIN'))

#initiliase the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db=SQLAlchemy(app)

class Products(db.Model):
    itemId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable = False)
    text = db.Column(db.String(3000), nullable = False)
    img = db.Column(db.String())
    img_data = db.Column(db.LargeBinary)
    price = db.Column(db.Integer, nullable = False)

    def any(self):
        return '<product itemId = {} ,title ={}, text={}, price={},>'.format(self.itemId, self.title, self.price)



#function to list products
def get_products():
	prod = Products.query.first()
	return prod.Products

@sio.event
def connect():
    print("connected")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', os.environ.get('FRONTEND_ORIGIN'))
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/aws_list/<user>',methods=['GET'])
def aws_list_files(user):
    response = s3_client.list_objects_v2(
        Bucket=os.getenv('S3_BUCKET_NAME'),
        Prefix=user
    )
    return {
        'status':200,
        'message':{
            'files':response.get('Contents')
        }
    }

@app.route('/ipfs_list/<user>',methods=['GET'])
def ipfs_list_files(user):
    url = "https://api.nft.storage"
    headers={
        "Authorization":"Bearer {}".format(os.getenv('IPFS_API_KEY'))
    }
    # get a number list of the file
    resp = requests.get(
        url,
        headers=headers
    )


    #
    return {
        'status':200,
        'message':{
            'files':resp.json().get('value')
        }
    }

@app.route('/aws_upload/<user>', methods=['POST'])
def aws_file_upload(user):

    # get a number list of the file
    resp = s3_client.list_objects_v2(
        Bucket=os.getenv('S3_BUCKET_NAME'),
        Prefix=user
    )
    contents = 0
    try:
        contents = len(resp.get('Contents'))
    except BaseException as e:
        None
    #

    # get the file mimetype extension
    ext  = mimetypes.guess_extension(request.headers.get('Content-Type'))
    #

    # upload to s3 and get the url
    filename = '{}-{}{}'.format(user,contents,ext)

    with open(filename, 'wb') as f:
        f.write(request.data)
        f.close()
    with open(filename, 'rb') as f:
        s3_client.upload_fileobj(
            f, os.getenv('S3_BUCKET_NAME'), filename,
            ExtraArgs={
                'ContentType':'',
                'ACL':'public-read'
            }
        )
        f.close()
    if os.path.exists(filename):
        os.remove(filename)
    #

    # update the current list in the frontend
    sio.emit('update',{'new':'true'})
    #

    return {
        'status': 200,
        'message':{
            'message':'OK',
            'object_url': "https://{}.s3.amazonaws.com/{}".format(
                os.getenv('S3_BUCKET_NAME'),
                filename
            )
        }
    }


@app.route('/ipfs_upload/<user>', methods=['POST','GET'])
def ipfs_file_upload(user):

    url = "https://api.nft.storage"
    headers={
        "Authorization":"Bearer {}".format(os.getenv('IPFS_API_KEY'))
    }
    # get a number list of the file
    resp = requests.get(
        url,
        headers=headers
    )
    contents = 0
    try:
        contents = len(resp.get('value'))
    except BaseException as e:
        None

    #

    # get the file mimetype extension
    ext  = mimetypes.guess_extension(request.headers.get('Content-Type'))
    #

    # upload to s3 and get the url
    filename = '{}-{}{}'.format(user,contents,ext)
    cid = ""
    with open(filename, 'wb') as f:
        f.write(request.data)
        f.close()
    with open(filename, 'rb') as f:

        resp = requests.post(
            url+"/upload",
            headers=headers,
            data=f
        )
        result  = resp.json()
        cid = result.get('value').get("cid")
        pprint.pprint(resp.json())
        f.close()
    if os.path.exists(filename):
        os.remove(filename)
    #

    # update the current list in the frontend
    sio.emit('update',{'new':'true'})
    #

    return {
        'status': 200,
        'message':{
            'message':'OK',
            'object_url': "https://ipfs.io/ipfs/{}".format(
                cid,
            )
        }
    }

