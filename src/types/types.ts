import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Detail: { item: ArtItem };
};

export type ArtItem = {
  id: number;
  artName: string;
  price: number;
  image: string;
 
};