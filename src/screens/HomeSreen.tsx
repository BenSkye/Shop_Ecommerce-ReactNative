import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, RefreshControl, ActivityIndicator, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getArtTools } from '../services/artToolsService';
import { useFavorites } from '../context/FavoritesContext';
import ArtToolCard from '../components/ArtToolCard';
import BackToTopButton from '../components/BackToTopButton';
import BrandFilter from '../components/BrandFilter';

interface ArtTool {
    id: string;
    artName: string;
    price: number;
    image: string;
    brand: string;
    limitedTimeDeal: number;
}

interface Category {
    id: string;
    name: string;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [artTools, setArtTools] = useState<ArtTool[]>([]);
    const { toggleFavorite, favorites } = useFavorites();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [brands, setBrands] = useState<Category[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false); // Hiển thị dropdown
    const [suggestions, setSuggestions] = useState<ArtTool[]>([]);  // Danh sách gợi ý

    useEffect(() => {
        const fetchArtTools = async () => {
            const data = await getArtTools();
            setArtTools(data);
            const uniqueBrands = getUniqueBrands(data);
            setBrands(uniqueBrands);
            setLoading(false);
        };
        fetchArtTools();
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filteredSuggestions = artTools.filter(tool =>
                tool.artName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tool.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true); // Hiển thị dropdown khi có kết quả
        } else {
            setShowSuggestions(false); // Ẩn dropdown nếu không có nội dung
        }
    }, [searchTerm, artTools]);

    const filteredArtTools = artTools.filter(tool =>
        (selectedBrand ? tool.brand === selectedBrand : true) &&
        (tool.artName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getUniqueBrands = (artTools: ArtTool[]) => {
        const brandsSet = new Set(artTools.map(tool => tool.brand));
        return Array.from(brandsSet).map(brand => ({ id: brand, name: brand }));
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollToTop(offsetY > 300);
    };

    const handleSuggestionSelect = (suggestion: ArtTool) => {
        setSearchTerm(suggestion.artName); // Cập nhật term khi chọn gợi ý
        setShowSuggestions(false); // Ẩn dropdown sau khi chọn
    };

    const renderArtTool = ({ item }: { item: ArtTool }) => {
        return (
            <View style={styles.cardContainer}>
                <ArtToolCard
                    item={item}
                    isFavorite={favorites.some((fav: ArtTool) => fav.id === item.id)}
                    onPress={() => navigation.navigate('Detail', { item })}
                    toggleFavorite={toggleFavorite}
                />
            </View>
        );
    };

    const renderFooter = () => {
        return loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <Text style={styles.footerText}>All products loaded</Text>
        );
    };

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={filteredArtTools}
                renderItem={renderArtTool}
                keyExtractor={(item) => item.id}
                numColumns={2}
                ListHeaderComponent={
                    <>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or brand"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        {showSuggestions && (
                            <ScrollView
                                style={styles.suggestionsContainer}
                                nestedScrollEnabled={true} // Cho phép cuộn trong FlatList
                                contentContainerStyle={styles.suggestionsContentContainer} // Đảm bảo các gợi ý được hiển thị đúng
                            >
                                {suggestions.map((suggestion, index) => (
                                    <TouchableOpacity
                                        key={suggestion.id}
                                        style={[
                                            styles.suggestionItem,
                                            index === suggestions.length - 1 && styles.suggestionItemLast, // Đảm bảo mục cuối không có border dưới
                                        ]}
                                        onPress={() => handleSuggestionSelect(suggestion)}
                                    >
                                        <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
                                        <View style={styles.suggestionTextContainer}>
                                            <Text style={styles.suggestionText}>{suggestion.artName}</Text>
                                            <Text style={styles.suggestionBrand}>{suggestion.brand}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <BrandFilter
                            brands={brands}
                            selectedBrand={selectedBrand}
                            onBrandSelect={setSelectedBrand}
                        />
                    </>
                }
                ListFooterComponent={renderFooter}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.flatListContent}
            />
            {showScrollToTop && (
                <BackToTopButton onPress={scrollToTop} />
            )}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingBottom: 50,
    },
    cardContainer: {
        flex: 0.5,
    },
    footerText: {
        padding: 10,
        textAlign: 'center',
    }, searchInput: {
        height: 40,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },


    suggestionsContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        marginBottom: 10,
        maxHeight: 200, // Giới hạn chiều cao của dropdown
        elevation: 3, // Đổ bóng cho dropdown
    },
    suggestionsContentContainer: {
        paddingVertical: 5, // Đệm bên trong
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        backgroundColor: '#fff',
    },
    suggestionItemLast: {
        borderBottomWidth: 0, // Không có border dưới ở mục cuối cùng
    },
    suggestionImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    suggestionBrand: {
        fontSize: 14,
        color: '#888',
    },

    suggestionItemPressed: {
        backgroundColor: '#e6e6e6', // Hiệu ứng khi nhấn vào
    },
});
