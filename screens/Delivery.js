// Library
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { icons, images, SIZES, COLORS, FONTS, GOOGLE_API_KEY } from '../constants'
import MapViewDirections from 'react-native-maps-directions';

const Delivery = ({ route, navigation }) => {
    const loacationDefault = {
        latitude: 14.498614,
        longitude: 109.085784
    }
    const [restaurant, setRestaurant] = useState(null)
    const [streetName, setStreetName] = useState('')
    const [fromLocation, setFromLocation] = useState(loacationDefault)
    const [toLocation, setToLocation] = useState(loacationDefault)
    const [region, setRegion] = useState(null)
    const [duration, setDuration] = useState(0)
    const [isReady, setReady] = useState(false)
    const [angle, setAngle] = useState({})
    const mapView = useRef(null)

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

    const calculateAngle = (coordinates) => {
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]
        let dx = endLat - startLat
        let dy = endLng - startLng

        return Math.atan2(dy, dx) * 180 / Math.PI
    }

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
                rotation={angle}
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
                    ref={mapView}
                    // provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={region}
                >
                    <MapViewDirections
                        origin={fromLocation}
                        destination={toLocation}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor={COLORS.primary}
                        optimizeWaypoints={false}
                        onReady={result => {
                            const { coordinates, distance, duration } = result
                            setDuration(duration)

                            if (!isReady) {
                                // Fit route into maps
                                mapView.current.fitToCoordinates(coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom: (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top: (SIZES.height / 8)
                                    }
                                })

                                // Reposition the car
                                const nextLoc = {
                                    latitude: coordinates[0]["latitude"],
                                    longitude: coordinates[0]["longitude"]
                                }

                                if (coordinates.length >= 2) {
                                    let angle = calculateAngle(coordinates)
                                    setAngle(angle)
                                }

                                setFromLocation(nextLoc)
                                setReady(true)
                            }
                        }}
                    />
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