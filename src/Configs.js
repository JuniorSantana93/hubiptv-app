import React from "react";
import {
   StyleSheet,
   View,
   TouchableHighlight,
   Image,
   Text, AsyncStorage, Alert
} from "react-native";
import { Container, ConfigsContainer, Config } from "./Components/Configs";

export default function Configs({ route, navigation }) {
   let NavOption = (props) => {
      return (
         <TouchableHighlight
            underlayColor='rgb(200,200,200)'
            onPress={props.onPress}
            style={[
               styles.navigator_navigatorOption,
               {
                  backgroundColor: props.selected
                     ? "rgb(200,200,200)"
                     : undefined
               },
            ]}>
            <>
               <Image
                  style={styles.navigator_navigatorOption_image}
                  resizeMethod='resize'
                  resizeMode='contain'
                  source={props.source}
               />
               <Text style={styles.navigator_navigatorOption_text}>
                  {props.text}
               </Text>
            </>
         </TouchableHighlight>
      );
   };

   return (
      <Container>
         <ConfigsContainer>
            <Config
               button
               text='Limpar cache'
               onPress={()=>{
                   AsyncStorage.clear((err)=>{
                       if(err) return Alert.alert('Erro', 'Por algum motivo não foi possível limpar o cache.')
                        Alert.alert('Limpo!','Cache limpado com sucesso')
                    })
               }}
               description='Limpar cache do Aplicativo como seus favoritos e outros dados.'
            />
         </ConfigsContainer>
         <View style={styles.navigator}>
            <NavOption
               onPress={() => navigation.navigate("Home")}
               text='Início'
               source={require("./assets/sydney-opera-house.png")}
            />
            <NavOption
               selected
               text='Configurações'
               source={require("./assets/settings.png")}
            />
         </View>
      </Container>
   );
}

const styles = StyleSheet.create({
   navigator: {
      height: 60,
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
   },
   navigator_navigatorOption: {
      height: "100%",
      width: "50%",
      justifyContent: "center",
      alignItems: "center"
   },
   navigator_navigatorOption_image: {
      width: "50%",
      height: "50%",
   },
   navigator_navigatorOption_text: {
      fontSize: 10,
   },
});
