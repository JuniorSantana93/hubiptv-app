import { StatusBar } from 'expo-status-bar';
import  React, { useState, useEffect } from "react";
import { StyleSheet, Text, View,TouchableHighlight, Image, Linking,ScrollView } from "react-native";
import { useFonts } from 'expo-font';

export default function Home({navigation}) {

    // Variaveis
        // Images
        let imgs = {
            logo_black: require('./assets/logo_black_back_white.png')
        }
    
    // Hooks
        // Use state
        let [data,setData] = useState(null);
        // Use effect
        useEffect(()=>{
            (async ()=>{
                let req = await fetch('https://ikaio.glitch.me/hubiptv-app-feed.json');
                let res = await req.json();

                setData(res);
            })()
        },[])
        //Fonts
        let [fontsloaded] = useFonts({
            OpenSans: require('./assets/OpenSans-Regular.ttf')
        })
    
    // Verifications
    if(!fontsloaded||!data) return (<></>);

    // Components
    let Ans = (props)=>{
        return data.data.ans.map(e=>{
            return (
                <View key={e.pre_title} style={styles.categ}>
            <Text style={styles.title}>• {e.pre_title}</Text>
            <View style={styles.contain}>
                <View style={[styles.contain_opacity,{backgroundColor: e.cor}]}/>
                <View style={styles.contain_infos}>
                    <TouchableHighlight onPress={()=>Linking.openURL(e.url)} style={styles.contain_infos_button}>
                        <><Text style={styles.contain_infos_button_text}>{e.button_name}</Text></>
                    </TouchableHighlight>
                    <Text style={styles.contain_infos_title}>• {e.title}</Text>
                </View>
                <Image resizeMethod="resize" source={{uri: e.back_image}} style={styles.contain_image}/>
            </View>
        </View>
            )
        })
    }
    let Aviso = ()=>{
        return (
            <TouchableHighlight onPress={()=>Linking.openURL(data.data.aviso.url)} style={[styles.aviso,{display: !data.data.aviso.mostra ? 'none' : undefined}]}>
                <Text style={styles.aviso_text}>{data.data.aviso.msg}</Text>
            </TouchableHighlight>
        )
    }
    let Line = ()=>{
        return (
            <View style={styles.line}/>
        )
    }
    let Channels = (props)=>{
        return (
            <TouchableHighlight underlayColor="rgba(200,200,200,0.3)" onPress={()=>navigation.navigate('ChannelOptions',{
                list_name: props.title,
                list_url: props.url
            })} style={styles.channel}>
                <>
                <Text style={styles.channel_title}>{props.title}</Text>
                <Text style={styles.channel_desc}>{props.desc}</Text>
                <View style={styles.channel_imgs}>
                    <Image resizeMethod="resize" style={styles.channel_imgs_img} resizeMode="contain" source={{uri: props.completa ? 'http://a5.vc/Xun' : 'http://a5.vc/JHX'}}/>
                    <Image resizeMethod="resize" style={styles.channel_imgs_img} resizeMode="contain" source={{uri: props.completa ? 'http://a5.vc/Sx8' : 'http://a5.vc/ezc'}}/>
                    <Image resizeMethod="resize" style={styles.channel_imgs_img} resizeMode="contain" source={{uri: props.completa ? 'http://a5.vc/aDZ' : 'http://a5.vc/BrP'}}/>
                    <Image resizeMethod="resize" style={styles.channel_imgs_img} resizeMode="contain" source={{uri: props.completa ? 'http://a5.vc/j8Y' : 'http://a5.vc/BsL'}}/>
                    <Image resizeMethod="resize" style={styles.channel_imgs_img} resizeMode="contain" source={{uri: props.completa ? 'http://a5.vc/TDh' : 'http://a5.vc/Ck2'}}/>
                </View>
                </>
            </TouchableHighlight>
        )
    }
    let Title = (props)=>{
        return (
        <Text style={styles.title}>{props.text}</Text>
        )
    }
    let NavOption = (props)=>{
        return (
            <TouchableHighlight underlayColor="rgb(200,200,200)" onPress={()=>true} style={styles.navigator_navigatorOption}>
                <>
                <Image style={styles.navigator_navigatorOption_image} resizeMethod="resize" resizeMode="contain" source={props.source}/>
                <Text style={styles.navigator_navigatorOption_text}>{props.text}</Text>
                </>
            </TouchableHighlight>
        )
    }

    // Render
   return (
    <View style={{flex: 1}}>
        <ScrollView decelerationRate="fast">
        <StatusBar translucent={false} style="dark" backgroundColor="white"/>
        <View style={styles.container}>
        <Image resizeMethod="resize" resizeMode="contain" style={styles.logo} source={imgs.logo_black}/>
        
        <Aviso />
        
        <Ans />
        
        <Line />

        <Title text="• Assista"/>

        <Channels 
            completa 
            title="Todos os conteúdos" 
            url="https://hubiptv.xyz/l"
            desc="Mais de 30 mil conteúdo, incluindo filmes, séries, canais abertos e fechados." 
        />
        <Channels 
            completa={false} 
            title="Só canais" 
            url="https://hubiptv.xyz/c"
            desc="Mais de mil conteúdo, incluindo canais abertos, canais 24hrs e fechados." 
        />
        </View>
    </ScrollView>
    <View style={styles.navigator}>
        <NavOption text="Home" source={require('./assets/sydney-opera-house.png')}/>
        <NavOption text="Home" source={require('./assets/settings.png')}/>
    </View>
    </View>
   )
};

let colors = {
    font: 'black',
    backgound: 'white',
    back_contrast: 'black'
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgound,
        flex: 1,
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100,
        top: 20
    },
    categ: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10
    },
    title: {
        fontFamily: 'OpenSans',
        color: colors.font,
        textAlign: 'left',
        width: '90%',
        fontSize: 20,
        fontWeight: '900'
    },
    contain: {
        height: 170,
        width: '90%',
        borderRadius: 15,
        top: 10,
        overflow: 'hidden',
        position: 'relative'
    },
    contain_image: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    contain_opacity: {
        height: '100%',
        width: '100%',
        opacity: 0.2,
        position: 'absolute',
        zIndex: 2
    },
    contain_infos: {
        width: '100%',
        position: 'absolute',
        zIndex: 2,
        height: '30%',
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contain_infos_title: {
        color: colors.backgound,
        overflow: 'hidden'
    },
    contain_infos_button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.backgound,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        marginHorizontal: 10
    },
    contain_infos_button_text: {
        color: colors.backgound,
        fontSize: 15
    },
    aviso: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aviso_text: {
        backgroundColor: 'rgb(255,100,100)',
        width: '95%',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        color: 'rgb(150,20,20)',
        fontSize: 15
    },
    line: {
        width: '90%',
        height: 0.7,
        marginVertical: 20,
        backgroundColor: colors.back_contrast
    },
    channel: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 4,
        width: '90%',
        overflow: 'hidden',
        marginVertical: 10
    },
    channel_title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    channel_imgs: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
        flexDirection: 'row'
    },
    channel_imgs_img: {
        height: '100%',
        width: '10%',
        tintColor: 'rgb(40,40,40)'
    },
    navigator: {
        height: 60,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    navigator_navigatorOption: {
        height: '100%',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navigator_navigatorOption_image: {
        width: '50%',
        height: '50%'
    },
    navigator_navigatorOption_text: {
        fontSize: 10
    }
})