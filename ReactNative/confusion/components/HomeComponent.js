import React, { Component } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

function RenderItem(props){
    
    const item = props.item;
    
    
        if(item != null){
            return(
                <Card featuredTitle={item.name} featuredSubtitle={item.designation} image={{uri: baseUrl+ item.image}}>
                    <Text style={{margin: 10}}>
                        {item.description}
                    </Text>
                </Card>
            );
        }
        else{
            return(<View></View>);
        }
    
}

class Home extends Component{
             
    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
    }
    
    static navigationOptions = {
        title: 'Home'  
    };
    
    /* To Setup Animation */
    componentDidMount(){
        this.animate();
    }

    /* timing() enables us to change animatedValue as a function of time*/
    /* this is changing from 0 to 8 in a duration of 8secs linearly and that change is mapped into corresponding xpos */
    animate(){
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 8,
                duration: 8000,
                easing: Easing.linear
            }
        ).start(()=>this.animate());
    }
    /* start() takes an end callback func */

    render(){
        
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });

        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });
        
        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });        
        
        if(this.props.dishes.isLoading || this.props.promotions.isLoading || this.props.leaders.isLoading){
            return(
                <Loading />
            );
        }
        else if(this.props.dishes.errMess || this.props.promotions.errMess || this.props.leaders.errMess){
            if(this.props.dishes.errMess)
                errMessage = this.props.dishes.errMess;
            else if(this.props.promotions.errMess)
                errMessage = this.props.promotions.errMess;
            else if(this.props.leaders.errMess)
                errMessage = this.props.leaders.errMess;
            
            return(
                <View>
                    <Text>{errMessage}</Text>
                </View>
            );
        }
        else {
        return(
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                <Animated.View style={{ width: '100%', transform: [{translateX: xpos1}] }}>
                    <RenderItem item={this.props.dishes.dishes.filter((dish)=>dish.featured === true)[0]} isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess}/>
                </Animated.View>
                <Animated.View style={{ width: '100%', transform: [{translateX: xpos2}] }}>
                    <RenderItem item={this.props.promotions.promotions.filter((promotion)=>promotion.featured === true)[0]} isLoading={this.props.promotions.isLoading} errMess={this.props.promotions.errMess}/>
                </Animated.View>
                <Animated.View style={{ width: '100%', transform: [{translateX: xpos3}] }}>
                    <RenderItem item={this.props.leaders.leaders.filter((leader)=>leader.featured === true)[0]} isLoading={this.props.leaders.isLoading} errMess={this.props.leaders.errMess}/>    
                </Animated.View>
            </View>
            );
        }
    }
}

export default connect(mapStateToProps)(Home);