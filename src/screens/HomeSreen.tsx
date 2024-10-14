import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, RefreshControl, ActivityIndicator, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getArtTools } from '../services/artToolsService';
import { useFavorites } from '../context/FavoritesContext';
import ArtToolCard from '../components/ArtToolCard';
import BackToTopButton from '../components/BackToTopButton';
import BrandFilter from '../components/BrandFilter';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    const [selectedBrand, setSelectedBrand] = useState<string | null>("all");
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
        (selectedBrand === "all" || tool.brand === selectedBrand) &&
        (tool.artName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getUniqueBrands = (artTools: ArtTool[]) => {
        const brandsSet = new Set(artTools.map(tool => tool.brand));
        return [{ id: "all", name: "All" }, ...Array.from(brandsSet).map(brand => ({ id: brand, name: brand }))];
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
        navigation.navigate('Detail', { item: suggestion });
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

    const SearchInput = ({ value, onChangeText }) => {
        return (
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or brand"
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#999"
                />
            </View>
        );
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
                        <SearchInput value={searchTerm} onChangeText={setSearchTerm} />
                        {showSuggestions && (
                            <ScrollView
                                style={styles.suggestionsContainer}
                                nestedScrollEnabled={true}
                                contentContainerStyle={styles.suggestionsContentContainer}
                            >
                                {suggestions.map((suggestion, index) => (
                                    <TouchableOpacity
                                        key={suggestion.id}
                                        style={[
                                            styles.suggestionItem,
                                            index === suggestions.length - 1 && styles.suggestionItemLast,
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
        backgroundColor: '#f4f4f4',
    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingBottom: 50,
    },
    cardContainer: {
        flex: 0.5,
        margin: 8, // Increased margin for better spacing
    },
    footerText: {
        padding: 10,
        textAlign: 'center',
        color: '#888',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 50,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        paddingVertical: 5,
        elevation: 2,
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 50,
        color: '#333',
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        maxHeight: 200, // Limit dropdown height
        elevation: 3, // Shadow for dropdown
    },
    suggestionsContentContainer: {
        paddingVertical: 5, // Padding inside
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    suggestionItemLast: {
        borderBottomWidth: 0,
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
        color: '#999',
    },
});
