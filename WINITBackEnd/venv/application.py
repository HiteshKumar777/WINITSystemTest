from asyncio.windows_events import NULL
import json
from flask import Flask, jsonify, request
from datetime import datetime
from flask_mysqldb import MySQL
from flask_cors import CORS

application = Flask(__name__)
CORS(application)
application.config['MYSQL_HOST'] = 'localhost'
application.config['MYSQL_USER'] = 'root'    
application.config['MYSQL_PASSWORD'] = ''
application.config['MYSQL_DB'] = 'minitdb'
application.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(application)

@application.route('/')
def FetchUserDetails():
    cur = mysql.connection.cursor()
    cur.execute("select * from Customer")
    result  = r = cur.fetchall()
    print(result)
    mysql.connection.commit()
    cur.close()
    return jsonify(r)

@application.route('/getCustomers',methods=['GET'])
def getCustomers():
    if request.method == 'GET':
        cur  = mysql.connection.cursor()
        cur.execute("select * from Customer")
        result = cur.fetchall()
        count  = cur.rowcount
        if count >=1:
            mysql.connection.commit()
            cur.close()
            return jsonify(result)
        else:
            return jsonify('Facing issue while fetching data')

@application.route('/getProducts',methods=['GET'])
def getProducts():
    if request.method == 'GET':
        cur  = mysql.connection.cursor()
        cur.execute("select * from Products")
        result = cur.fetchall()
        count  = cur.rowcount
        if count >=1:
            mysql.connection.commit()
            cur.close()
            return jsonify(result)
        else:
            return jsonify('Facing issue while fetching data')


@application.route('/postIntoCart', methods=['POST'])
def postIntoCart():
    if request.method == 'POST':
        result = request.data
        cartdetails  = json.loads(result)
        customerid = cartdetails['customerid']
        productid = cartdetails['productsid']
        cur = mysql.connection.cursor()
        print(customerid)
        for i in range(len(productid)):
            print(productid[i])
            product = productid[i]
            cur.execute('Insert into cart values(NULL,Null,%s,%s,%s,Null)',(product,customerid,0))    
        mysql.connection.commit()
        cur.close()  
        return jsonify('Item Added')  

@application.route('/getCartList',methods=['GET'])
def getCartList():
    if request.method == 'GET':
        cur  = mysql.connection.cursor()
        cur.execute("select * from Cart as c, Customer as cus, Products as p where c.Cust_Id = cus.Cust_Id and c.P_Id = p.P_Id and c.Ordered = 0 ")
        result = cur.fetchall()
        count  = cur.rowcount
        if count >=1:
            mysql.connection.commit()
            cur.close()
            return jsonify(result)
        else:
            return jsonify('Facing issue while fetching data')
@application.route('/getCartGroupBy',methods=['GET'])
def getCartGroupBy():
    if request.method == 'GET':
        cur  = mysql.connection.cursor()
        cur.execute("select c.Cust_Id, Cust_Name from Cart as c, Customer as cus, Products as p where c.Cust_Id = cus.Cust_Id and c.P_Id = p.P_Id and c.Ordered = 0 GROUP BY Cust_Name")
        result = cur.fetchall()
        count  = cur.rowcount
        if count >=1:
            mysql.connection.commit()
            cur.close()
            return jsonify(result)
        else:
            return jsonify('Facing issue while fetching data')

@application.route('/updateQTY/<cartId>/<QTY>',methods=['GET'])
def updateQTY(cartId,QTY):
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute('''Update cart SET QTY=%s 
        Where OI_Id=%s
        ''',(QTY,cartId))
        mysql.connection.commit()
        cur.close()
        return jsonify('Cart Updated Successfully')

@application.route('/deleteCart/<cartId>',methods=['DELETE'])
def deleteCart(cartId):
    if request.method == 'DELETE':
        cur = mysql.connection.cursor()
        cur.execute("Delete from cart Where OI_Id ='"+cartId+"' ")
        mysql.connection.commit()
        cur.close()
        return jsonify('Cart Deleted Succesfully')

@application.route('/updateOrder', methods=['POST'])
def updateOrder():
    if request.method == 'POST':
        result = request.data
        cartdetails  = json.loads(result)
        customerid = cartdetails['customerid']
        orderOn = datetime.now()
        cur = mysql.connection.cursor()
        print(customerid)
        cur = mysql.connection.cursor()
        for i in range(len(customerid)):
            cur.execute('''Update cart SET Ordered=%s, Date=%s Where Cust_Id=%s''',(True,orderOn,customerid[i]))
        
        mysql.connection.commit()
        cur.close()   
        return jsonify('Item Added') 

if __name__ == "__main__":
    application.run(debug=True)