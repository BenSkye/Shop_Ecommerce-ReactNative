import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';

interface Brand {
    id: string;
    name: string;
}

interface BrandFilterProps {
    brands: Brand[];
    selectedBrand: string | null;
    onBrandSelect: (brandId: string | null) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ brands, selectedBrand, onBrandSelect }) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 1.1,
            friction: 2,
            tension: 160,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 2,
            tension: 160,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.brandFilterContainer}>
            <Text style={styles.filterTitle}>Filter by Brand:</Text>
            <FlatList
                data={brands}
                horizontal
                keyExtractor={(brand) => brand.id}
                renderItem={({ item }) => {
                    const isSelected = selectedBrand === item.id;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => onBrandSelect(isSelected ? null : item.id)}
                        >
                            <Animated.View
                                style={[
                                    styles.brandTag,
                                    isSelected ? styles.selectedBrandTag : null,
                                    { transform: [{ scale: scaleValue }] }, // Apply scaling effect
                                ]}
                            >
                                <Text style={isSelected ? styles.selectedBrandText : styles.brandTagText}>
                                    {item.name}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default BrandFilter;

const styles = StyleSheet.create({
    brandFilterContainer: {
        padding: 10,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000', // Màu chữ tiêu đề
    },
    brandTag: {
        padding: 8,
        margin: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDDDDD', // Xám nhạt
        backgroundColor: '#FFCCCC', // Đỏ nhạt
        elevation: 3,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    selectedBrandTag: {
        backgroundColor: '#CC0000', // Đỏ đậm
    },
    brandTagText: {
        color: '#000000', // Đen
    },
    selectedBrandText: {
        fontWeight: 'bold',
        color: '#FFFFFF', // Trắng
    },
});

