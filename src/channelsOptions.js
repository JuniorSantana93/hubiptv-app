import React, { useState, useRef, useEffect } from "react";
import {
   StyleSheet,
   Text,
   View,
   TouchableHighlight,
   FlatList,
   Image,
   ActivityIndicator,
   TextInput,
} from "react-native";

export default function ChannelOptions({ route, navigation }) {
   // Use state
   let [p, setP] = useState(route.params);
   let [data, setData] = useState(null);
   let [currentList, setCurrentList] = useState(null);
   // Use effect
   useEffect(() => {
      (async () => {
         let req = await fetch(p.list_url);
         let res = await req.text();
         res = getJsonList(res);
         setData(res);
         setCurrentList(res);
      })();
   },[]);

   // Functions

   function getJsonList(list = "") {
      let lista = list.toString();
      if (!lista.includes("#EXTM3U")) {
         return "getJsonList error: this is not a IPTV list";
      }
      lista = lista + " SENYDE";
      lista = lista.split("#EXTINF").join("SENYDEEXTINF");
      lista = lista.split('",').join('"SCNLGME ');
      let channels = [];
      let lista_em_array = lista.match(/EXTINF([\S\s]*?)SENYDE/g);
      lista_em_array.forEach((ch) => {
         let img = null;
         if (ch.match(/tvg-logo="([\S\s]*?)"/i)) {
            img = ch.match(/tvg-logo="([\S\s]*?)"/i)[1];
         }
         let nome = ch.match(/"SCNLGME([\S\s]*?)http/i)[1];
         nome = nome.replace("\r", "");
         nome = nome.replace("\n", "");
         let grupo = null;
         if (ch.match(/group-title="([\S\s]*?)"/i)) {
            grupo = ch.match(/group-title="([\S\s]*?)"/i)[1];
         }
         let link = "null";
         if (ch.match(/https?:\/\/[^\s]+/gi).length == 1) {
            link = ch.match(/https?:\/\/[^\s]+/gi)[0];
         } else {
            link = ch.match(/https?:\/\/[^\s]+/gi)[1];
         }
         channels.push({
            channel_name: nome,
            img: img,
            group: grupo,
            video_url: link,
         });
      });
      return channels;
   }

   function Body({item}) {
         let e = item;
         return (
            <TouchableHighlight
               onPress={() =>
                  navigation.navigate("Player", {
                     url: e.video_url,
                     name: e.channel_name,
                     group: e.group,
                     image: e.img,
                     list: currentList
                  })
               }
               key={e.channel_name + Math.round(Math.random() * 1000)}
               style={styles.canal}
               underlayColor="rgb(200,200,200)"
            >
               <>
                  <Image
                     resizeMode="contain"
                     style={styles.canal_img}
                     source={{
                        uri: e.img
                           ? e.img
                           : "https://image.flaticon.com/icons/svg/803/803253.svg",
                     }}
                     resizeMethod="resize"
                  />
                  <View style={styles.canal_texts}>
                     <Text style={styles.canal_texts_nome}>
                        {e.channel_name}
                     </Text>
                     <Text style={styles.canal_texts_currentProgram}>
                        {e.group}
                     </Text>
                  </View>
               </>
            </TouchableHighlight>
         );
   }

   function NavOption(props) {
      return (
         <TouchableHighlight underlayColor="rgb(200,200,200)" onPress={props.isNav ? ()=>navigation.navigate(props.page,props.params) : ()=>search(props.search)} style={styles.navigator_buttons}>
            <>
               <Image
                  style={styles.navigator_buttons_image}
                  resizeMode="contain"
                  resizeMethod="resize"
                  source={props.source}
               />
               <Text style={styles.navigator_buttons_text}>{props.title}</Text>
            </>
         </TouchableHighlight>
      );
   }

   function search(text) {
      let newList = [];
      data.forEach((e) => {
         if (
            e.channel_name.toLowerCase().includes(text.toLowerCase()) ||
            e.group.toLowerCase().includes(text.toLowerCase())
         ) {
            newList.push(e);
         }
      });
      setCurrentList(newList);
   }

   if (!currentList)
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
         >
            <Text>Carregando canais...</Text>
            <ActivityIndicator color="black" size="large" />
         </View>
      );
   return (
      <View style={styles.all}>
         <View style={styles.search}>
            <TouchableHighlight underlayColor="rgb(150,150,150)" onPress={()=>navigation.goBack()} style={styles.search_back}>
               <><Image style={styles.backButton} resizeMethod="resize" resizeMode="contain" source={require('./assets/left-arrow.png')}/></>
            </TouchableHighlight>
            <TextInput
               onChangeText={(e) => search(e)}
               selectionColor="black"
               placeholder="Pesquisar por título ou categoria"
               style={styles.search_input}
            />
         </View>
         <FlatList 
            disableVirtualization={true}
            initialNumToRender={100}
            keyExtractor={e => e.channel_name + Math.round(Math.random() * 8787676)}
            style={styles.ScrollView}
            data={currentList}
            renderItem={Body}
         />
         <View style={styles.navigator}>
            <NavOption search="[24H]" source={require("./assets/clock.png")} title="Canais 24h"/>
            <NavOption search="Infantis" source={require("./assets/baby.png")} title="Infantis"/>
            <NavOption search="4K FHDR" source={require("./assets/4k.png")} title="4K"/>
            <NavOption search="HBO" source={require("./assets/hbo.png")} title="HBOs"/>
            <NavOption page="Favoritos" params={{list: currentList}} source={require("./assets/star.png")} isNav title="Favoritos"/>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   ScrollView: {
      width: "100%",
   },
   all: {
      flex: 1,
      alignItems: "center",
   },
   container: {},
   canal: {
      alignItems: "center",
      flexDirection: "row",
      paddingVertical: 10,
   },
   canal_img: {
      height: "100%",
      width: 60,
      marginLeft: 10,
      backgroundColor: "rgba(0,0,0,0.2)",
   },
   canal_texts: {
      marginLeft: 10,
   },
   canal_texts_nome: {
      fontSize: 20,
      fontWeight: "bold",
   },
   search: {
      width: "96%",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: 'row',
      paddingVertical: 5
   },
   search_input: {
      padding: 5,
      paddingHorizontal: 10,
      width: "90%",
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
   },
   navigator: {
      backgroundColor: "white",
      width: "100%",
      height: 60,
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
   },
   navigator_buttons: {
      height: "100%",
      width: "20%",
      alignItems: "center",
      justifyContent: "center",
   },
   navigator_buttons_image: {
      height: "50%",
      width: "50%",
   },
   navigator_buttons_text: {
      fontSize: 10
   },
   search_back: {
      backgroundColor: 'rgb(200,200,200)',
      padding: 8,
      borderRadius: 100,
      right: 3
   },
   backButton: {
      height: 20,
      width: 20,
      tintColor: 'black'
   }
});

/*<Text style={styles.canal_texts_currentProgram}>
   harry potter e a orden da fenixnnnnnnnnnnnnnnnnnnnnnnnn
</Text>*/

/*<View style={styles.all}>
         <View style={styles.search}>
            <TextInput
               onChangeText={(e) => search(e)}
               selectionColor="black"
               placeholder="Pesquisar por filme, série ou canal"
               style={styles.search_input}
            />
         </View>
         <ScrollView style={styles.ScrollView}>
            <View style={styles.container}>
               <Body />
            </View>
         </ScrollView>
      </View>*/
