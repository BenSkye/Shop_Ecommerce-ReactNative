import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const DetailScreen = ({ route }) => {
    const { item } = route.params;
    const { toggleFavorite, favorites } = useFavorites();

    const isFavorite = favorites.some(fav => fav.id === item.id);
    const animatedValue = new Animated.Value(1);

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

    return (
        <View style={styles.container}>
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
                        color={isFavorite ? 'red' : 'black'}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default DetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // Thêm đổ bóng cho hình ảnh
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4, // Đổ bóng nhẹ cho container chi tiết
    },
    artName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center', // Căn giữa tên sản phẩm
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 5,
        textAlign: 'center', // Căn giữa giá
    },
    discount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red', // Màu đỏ để làm nổi bật thông tin giảm giá
        marginBottom: 15,
        textAlign: 'center', // Căn giữa thông tin giảm giá
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center', // Căn giữa phần mô tả
    },
    favoriteButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // Đổ bóng cho nút yêu thích
    },
});
