import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated, FlatList, Dimensions, ScrollView } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';





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
        return Array.from({ length: 5 }, (_, index) => (
            <Icon
                key={`star-${index}`}
                name={index < rating ? 'star' : 'star-o'}
                size={18}
                color="#FFD700"
            />
        ));
    };

    const filteredComments = item.reviews.filter(review => {
        return selectedRating === 'all' || review.rating === parseInt(selectedRating);
    });
    console.log('Filtered Comments:', filteredComments);

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments found</Text>
        </View>
    );

    const renderRatingButton = (rating) => (
        <Pressable
            key={`rating-${rating}`}
            style={[
                styles.ratingButton,
                selectedRating === rating.toString() && styles.selectedRatingButton
            ]}
            onPress={() => setSelectedRating(rating.toString())}
        >
            <Text style={[
                styles.ratingButtonText,
                selectedRating === rating.toString() && styles.selectedRatingButtonText
            ]}>
                {rating === 'all' ? 'All' : `${rating} ${rating === '1' ? 'Star' : 'Stars'}`}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ratingButtonsContainer}>
                        {['all', 1, 2, 3, 4, 5].map(rating => renderRatingButton(rating))}
                    </ScrollView>
                </View>

                <FlatList
                    data={filteredComments}
                    renderItem={renderComment}
                    ListEmptyComponent={renderEmptyComponent}
                    keyExtractor={(review, index) => index.toString()}
                    scrollEnabled={false}
                />
            </ScrollView>

            <Pressable
                style={styles.floatingButton}
                onPress={() => navigation.navigate('Tabs', { screen: 'Favorites', params: { fromDetail: true, detailItem: item } })}
            >
                <Ionicons name="bookmark" size={30} color="white" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    artName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 5,
    },
    discount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF4500',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        lineHeight: 24,
    },
    favoriteButton: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    filterContainer: {
        padding: 20,
        backgroundColor: '#fff',
    },
    filterLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ratingButtonsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    ratingButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    selectedRatingButton: {
        backgroundColor: '#1E90FF',
    },
    ratingButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedRatingButtonText: {
        color: '#fff',
    },
    commentContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    commentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
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
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: 'row',
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
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});

export default DetailScreen;
