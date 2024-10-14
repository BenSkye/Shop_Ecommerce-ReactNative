import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface ArtToolCardProps {
    item: {
        id: string;
        artName: string;
        price: number;
        image: string;
        limitedTimeDeal: number;
    };
    isFavorite: boolean;
    onPress: () => void;
    toggleFavorite: (item: ArtToolCardProps['item']) => void;
}

const ArtToolCard: React.FC<ArtToolCardProps> = ({ item, isFavorite, onPress, toggleFavorite }) => {
    const discountedPrice = item.limitedTimeDeal > 0 ? item.price * (1 - item.limitedTimeDeal) : item.price;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Image source={{ uri: item.image }} style={styles.artToolImage} />
                {item.limitedTimeDeal > 0 && (
                    <View style={styles.dealBadge}>
                        <Text style={styles.limitedDeal}>{item.limitedTimeDeal * 100}% OFF</Text>
                    </View>
                )}
                <View style={styles.artToolInfo}>
                    <Text style={styles.artToolName} numberOfLines={2} ellipsizeMode="tail">{item.artName}</Text>
                    <View style={styles.priceContainer}>
                        {item.limitedTimeDeal > 0 && (
                            <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>
                        )}
                        <Text style={styles.newPrice}>${discountedPrice.toFixed(2)}</Text>
                    </View>
                    <Pressable
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item)}
                    >
                        <MaterialCommunityIcons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF6B6B" : "#333"}
                        />
                    </Pressable>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    artToolImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    dealBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    limitedDeal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    artToolInfo: {
        padding: 16,
    },
    artToolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oldPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    newPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});

export default ArtToolCard;
