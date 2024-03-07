import React, { useRef } from 'react'
import { View, Text, StyleSheet, Button,Image,TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useDispatch, useSelector } from 'react-redux'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
function Orders({navigation}) {
  const dispatch = useDispatch();
  const purchase = useSelector(state => state.cart.purchase)
  // console.log(purchase[0].products,"Zero");

  const htmlRef = useRef(null);
  // console.log(purchase);
  const generatePdf = async () => {
    const options = {
      html: `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #dddddd;
          }
          .total{
            text-align: right;
          }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <h2>Date and Time: ${purchase.dateAndTime}</h2>
        <h2>Phone Number: ${purchase.phoneNumber}</h2>
        <h2>Phone Number: ${purchase.txnId}</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
          ${purchase.products
          .map((product) => {
            return `<tr key=${product._id}>
            <td>${product.productName}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.totalPrice}</td>
          </tr>`;
          })
          .join("")}
          </tbody>
        </table>
        <h2 class='total'>Total: ${purchase.payTotal}</h2>
      </body>
    </html>`,
      fileName: 'invoice13',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log(file);
  };

  return (
    <ScrollView >
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>Invoice</Text>
        </View>
        {purchase.map((product) => (
        <View style={styles.body} ref={htmlRef}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Phone Number: {purchase.phoneNumber}</Text>
            <Text style={styles.footerText}>txnId: {purchase.txnId}</Text>
            <Text style={styles.footerText}>Date and Time: {purchase.dateAndTime}</Text>

          </View>
          <View style={styles.product}>
            <Text style={styles.productText}>Product</Text>
            <Text style={styles.productText}>Price</Text>
            <Text style={styles.productText}>Quantity</Text>
            <Text style={styles.productText}>Total</Text>
          </View>
          
            <View style={styles.product} key={product._id}>
              {product.map((item) => (
                <View style={styles.product} key={item._id}>
                  <Text style={styles.productText}>{item.productName}</Text>
                  <Text style={styles.productText}>{item.price}</Text>
                  <Text style={styles.productText}>{item.quantity}</Text>
                  <Text style={styles.productText}>{item.totalPrice}</Text>
                </View>
              ))}
            </View>

          <View style={styles.total}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>{purchase.payTotal}</Text>
          </View>
        </View>
        ))}

        <Button title="Generate PDF" onPress={generatePdf} />
        <View style={{height:hp(100),justifyContent:'center',alignItems:'center'}}>
      <Image style={{width:wp(80),height:wp(80)}} source={require('../../assets/images/EmptyCart.jpeg')}></Image>
      <TouchableOpacity onPress={()=>navigation.navigate('Scanner')}>
        <Text style={{color:'#6E4DE4',fontSize:wp(7),fontFamily:"Kalnia-Medium"}}>Continue shopping</Text>
      </TouchableOpacity>
      </View>



      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    // flex: 1,
    width: wp(96),
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 30
  },
  product: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 2,

    borderStyle: 'dashed'
  },
  productText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18
  },
  total: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  totalText: {
    // flex: 1,
    marginRight: wp(15),
    fontSize: 30,
    fontWeight: 'bold',

  },
  footer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
export default Orders

