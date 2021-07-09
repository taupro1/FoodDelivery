import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants'
import axios from 'axios';

const Search = ({navigation}) => {
    const [input, setInput] = useState('')
    const [restaurants, setRestaurants] = useState([])
    const [categories, setCategories] = useState([])
    const arrRestaurant = useRef(null)

    useEffect(() => {
        async function getCategoryFood() {
            const listFood = await axios.get('/category-food')

            if (listFood) {
                setCategories(listFood.data)
            }
        }

        async function getRestaurants() {
            const listRestaurant = await axios.get('/restaurant')

            if (listRestaurant) {
                arrRestaurant.current = listRestaurant.data
                setRestaurants(listRestaurant.data)
            }
        }

        getCategoryFood()
        getRestaurants()
    }, [])

    const getCategoryNameById = (categoryId) => {
        if (categories.length) {
            const category = categories.find(item => item.id === categoryId)

            return category.name
        }
    }

    const renderHeaderSearch = () => {
        return (
            <View
                style={{
                    height: SIZES.width * 0.1,
                    marginBottom: SIZES.padding * 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <TextInput
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: SIZES.width * 0.9,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding * 2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                    value={input}
                    placeholder='Search restaurant'
                    autoFocus
                    onChangeText={(value) => setInput(value)}
                    clearButtonMode='always'
                    maxLength={255}
                    onSelectionChange={() => console.log('1')}
                >
                </TextInput>
            </View>
        )
    }

    const renderListRestaurant = () => {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{ marginBottom: SIZES.padding * 2 }}
                    onPress={() => navigation.navigate('Restaurant', {
                        restaurant: item,
                        currentLocation
                    })}
                >
                    <View style={{marginBottom: SIZES.padding}}>
                        <Image
                            source={images[item.photo]}
                            resizeMode="cover"
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: SIZES.radius
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                height: 50,
                                width: SIZES.width * 0.3,
                                backgroundColor: COLORS.white,
                                borderTopRightRadius: SIZES.radius,
                                borderBottomLeftRadius: SIZES.radius,
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...styles.shadow
                            }}
                        >
                            <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
                        </View>
                    </View>

                    {/* Restaurant Info */}
                    <Text style={{ ...FONTS.body2 }}>{item.name}</Text>
                    <View
                        style={{
                            marginTop: SIZES.padding,
                            flexDirection: 'row'
                        }}
                    >
                        {/* Rating */}
                        <Image
                            source={icons.star}
                            style={{
                                height: 20,
                                width: 20,
                                tintColor: COLORS.primary,
                                marginRight: 10
                            }}
                        />
                        <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>

                        {/* Categories */}
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: 10
                            }}
                        >
                            {
                                item.categories.map((categoryId) => {
                                    return (
                                        <View
                                            style={{ flexDirection: 'row' }}
                                            key={categoryId}
                                        >
                                            <Text style={{ ...FONTS.body3 }}>{getCategoryNameById(categoryId)}</Text>
                                            <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>

                        {/* Price */}
                        {
                            [1, 2, 3].map((priceRating) => (
                                <Text
                                    key={priceRating}
                                    style={{
                                        ...FONTS.body3,
                                        color: (priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray
                                    }}
                                >$</Text>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            )
        }

        const arrRestaurant = restaurants.length ? restaurants.filter((item) => {
            return item.name.toLowerCase().indexOf(input.toLowerCase()) !== -1
        }) : []

        return (
            <FlatList
                data={arrRestaurant}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30
                }}
            />
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.lightGray2
            }}
        >
            {renderHeaderSearch()}
            {renderListRestaurant()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})

export default Search