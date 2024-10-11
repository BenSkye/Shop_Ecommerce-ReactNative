import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated, FlatList, Dimensions } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';



const { width: screenWidth } = Dimensions.get('window');

type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>; // Create type for navigation prop

const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF0QxSZCjz-8JefhrJrJwtL5i7utqDsRhv7Q&s';

const DetailScreen = ({ route }) => {
    const { item } = route.params;
    const { toggleFavorite, favorites } = useFavorites();
    const [selectedRating, setSelectedRating] = useState('all'); // State to store the selected rating filter
    const navigation = useNavigation<DetailScreenNavigationProp>(); // Hook for navigation

    const isFavorite = favorites.some(fav => fav.id === item.id);
    const animatedValue = useRef(new Animated.Value(1)).current;

    const handleToggleFavorite = () => {
        toggleFavorite(item);
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const renderComment = ({ item: review }) => (
        <View style={styles.commentContainer}>
            <Image
                source={{ uri: review.avatar || DEFAULT_AVATAR }}
                style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{review.user}</Text>
                <Text style={styles.commentText}>{review.comment}</Text>
                <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                </View>
            </View>
        </View>
    );

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Icon
                    key={i}
                    name={i <= rating ? 'star' : 'star-o'}
                    size={18}
                    color="#FFD700"
                />
            );
        }
        return stars;
    };

    const filteredComments = item.reviews.filter(review => {
        return selectedRating === 'all' || review.rating === parseInt(selectedRating);
    });
    console.log('Filtered Comments:', filteredComments);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.artName}>{item.artName}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                            {item.limitedTimeDeal > 0 && (
                                <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
                                    <Text style={styles.discount}>{item.limitedTimeDeal * 100}% OFF</Text>
                                </Animated.View>
                            )}
                            <Text style={styles.description}>{item.description}</Text>
                            <Pressable
                                onPress={handleToggleFavorite}
                                style={({ pressed }) => [
                                    styles.favoriteButton,
                                    { backgroundColor: pressed ? '#e6e6e6' : '#f0f0f0' }
                                ]}
                            >
                                <Ionicons
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={30}
                                    color={isFavorite ? 'red' : '#333'}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.filterContainer}>
                            <Text style={styles.filterLabel}>Filter by Rating:</Text>
                            <Picker
                                selectedValue={selectedRating}
                                onValueChange={(itemValue) => {
                                    setSelectedRating(itemValue);
                                    console.log('Selected rating:', itemValue); // Thêm dòng này để kiểm tra
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="All" value="all" />
                                <Picker.Item label="1 Star" value="1" />
                                <Picker.Item label="2 Stars" value="2" />
                                <Picker.Item label="3 Stars" value="3" />
                                <Picker.Item label="4 Stars" value="4" />
                                <Picker.Item label="5 Stars" value="5" />
                            </Picker>
                        </View>
                    </View>
                }
                data={filteredComments}
                renderItem={renderComment}
                keyExtractor={(review, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                getItemLayout={(data, index) => (
                    { length: 70, offset: 70 * index, index }
                )}
            />
            <Pressable
                style={styles.floatingButton}
                onPress={() => navigation.navigate('Tabs', {
                    screen: 'Favorites'
                })}
            >
                <Ionicons name="bookmark" size={30} color="white" />
            </Pressable>
        </View>
    );
};

export default DetailScreen;

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: screenWidth - 40,
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    artName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 5,
        textAlign: 'center',
    },
    discount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    favoriteButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#555',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    // Filter Styles
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker: {
        width: 150,
        height: 40,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#FF6347',
        borderRadius: 30,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
});
