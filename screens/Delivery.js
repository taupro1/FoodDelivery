// Library
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, {Marker} from 'react-native-maps'
import { icons, images, SIZES, COLORS, FONTS, GOOGLE_API_KEY } from '../constants'

const Delivery = ({route, navigation}) => {
    const [restaurant, setRestaurant] = useState(null)
    const [streetName, setStreetName] = useState('')
    const [fromLocation, setFromLocation] = useState({})
    const [toLocation, setToLocation] = useState({})
    const [region, setRegion] = useState(null)

    useEffect(() => {
        let { restaurant, currentLocation } = route.params;
        let fromLoc = currentLocation.gps
        let toLoc = restaurant.location
        let street = currentLocation.streetName

        let mapRegion = {
            latitude: (fromLoc.latitude + toLoc.latitude) / 2,
            longitude: (fromLoc.longitude + toLoc.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2
        }

        setRestaurant(restaurant)
        setStreetName(street)
        setFromLocation(fromLoc)
        setToLocation(toLoc)
        setRegion(mapRegion)
    }, [])

    const renderMap = () => {
        const destinationMarker = () => (
            <Marker
                coordinate={toLocation}
            >
                <View
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white
                    }}
                >
                    <View
                        style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.primary
                        }}
                    >
                        <Image
                            source={icons.pin}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.white
                            }}
                        />
                    </View>
                </View>
            </Marker>
        )

        const carIcon = () => (
            <Marker
                coordinate={fromLocation}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
                // rotation={angle}
            >
                <Image
                    source={icons.car}
                    style={{
                        width: 40,
                        height: 40
                    }}
                />
            </Marker>
        )

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                >
                    {destinationMarker()}
                    {carIcon()}
                </MapView>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {renderMap()}
        </View>
    )
}

export default Delivery;