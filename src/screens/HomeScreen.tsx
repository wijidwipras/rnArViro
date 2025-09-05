import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const FeatureCard = ({
  title,
  image,
  onPress,
  cardStyle,
  imgStyle,
  backgroundSource,
}: {
  title: string;
  image: any;
  onPress: () => void;
  cardStyle?: StyleProp<ViewStyle>;
  imgStyle?: StyleProp<ViewStyle>;
  backgroundSource?: ImageSourcePropType;
}) => (
  <TouchableOpacity
    style={[styles.featureWrap, styles.featureShadow]}
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel={`Buka fitur ${title}`}
    testID={`feature-${title.replace(/\s+/g, '-').toLowerCase()}`}
  >
    {backgroundSource ? (
      <ImageBackground
        source={backgroundSource}
        style={[styles.featureCard, cardStyle]}
        imageStyle={styles.featureBgImage}>
        <View style={styles.featureBg}>
          <Text category="s1" style={styles.featureTitle}>
            {title}
          </Text>
          <Image source={image} style={[styles.featureImage, imgStyle]} resizeMode="contain" />
        </View>
      </ImageBackground>
    ) : (
      <View style={[styles.featureCard, cardStyle]}>
        <View style={styles.featureBg}>
          <Text category="s1" style={styles.featureTitle}>
            {title}
          </Text>
          <Image source={image} style={[styles.featureImage, imgStyle]} resizeMode="contain" />
        </View>
      </View>
    )}
  </TouchableOpacity>
);

const HomeScreen = ({navigation}: any) => {
  const [status] = useState<'data'>('data');

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <LinearGradient
            colors={["#f8cc74ff", "#f9ad2b"]}
            start={{x: 0.1, y: 0.0}}
            end={{x: 0.9, y: 1.0}}
            style={styles.headerCard}>
            <View style={styles.headerLogoWrap}>
              <Image
                source={require('../assets/images/logo-criti-space.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text category="h5" style={styles.headerTitle}>Hai, User</Text>
              <Text style={styles.headerSubtitle}>
                O alfabeto em Libras sao sinais datilológicos, ou seja, realizados com os dedos.
              </Text>
            </View>
          </LinearGradient>

          <Text style={styles.exploreText}>Explore fitur</Text>

          {status === 'data' && (
            <View style={styles.grid}>
              <FeatureCard
                title="Explore in AR"
                image={require('../assets/images/explore-in-ar.png')}
                onPress={() => navigation.navigate('AR')}
                cardStyle={{backgroundColor: '#f5faf4', borderRadius: 23, height: 191}}
                backgroundSource={require('../assets/images/explore-in-ar-bg.png')}
              />
              <FeatureCard
                title="Problem Challenge"
                image={require('../assets/images/problem-challenge.png')}
                onPress={() => navigation.navigate('Next')}
                cardStyle={{backgroundColor: '#fef6f4', borderRadius: 23, height: 224}}
                imgStyle={{height: 130}}
                backgroundSource={require('../assets/images/problem-challenge-bg.png')}
              />
              <FeatureCard
                title="Geogebra Lab"
                image={require('../assets/images/geogebra-lab.png')}
                onPress={() => navigation.navigate('Next')}
                cardStyle={{backgroundColor: '#fffaf0', borderRadius: 23, height: 224}}
                imgStyle={{height: 130}}
                backgroundSource={require('../assets/images/geogebra-lab-bg.png')}
              />
              <FeatureCard
                title="My Progress"
                image={require('../assets/images/my-progress.png')}
                onPress={() => navigation.navigate('Next')}
                cardStyle={{backgroundColor: '#f5f6fd', borderRadius: 23, height: 191}}
                backgroundSource={require('../assets/images/my-progress-bg.png')}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  safe: {flex: 1},
  scroll: {padding: 16},
  headerCard: {
    marginBottom: 25,
    borderRadius: 16,
    borderColor: 'transparent',
    height: 227,
    padding: 20,
  },
  exploreText: {fontSize: 18, fontWeight: '700', marginBottom: 20},
  headerLogoWrap: {paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4, alignItems: 'flex-start'},
  headerLogo: {height: 40, aspectRatio: 3},
  headerTextWrap: {paddingHorizontal: 12, paddingBottom: 12},
  headerTitle: {color: '#FFFFFF', marginTop: 12},
  headerSubtitle: {color: '#FFFFFF'},
  grid: {flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-between', height: 450},
  featureWrap: {width: '47%', marginRight: '4%', marginBottom: 17},
  featureCard: {borderRadius: 23, overflow: 'hidden', elevation: 2, padding: 0},
  featureBg: {width: '100%', height: '100%', justifyContent: 'space-between', borderRadius: 23, padding: 20},
  featureBgImage: {borderRadius: 23},
  featureTitle: {marginBottom: 3, fontSize: 16, fontWeight: '700'},
  featureImage: {width: '100%', height: 120, display: 'flex', justifyContent: 'flex-end'},
  featureShadow: {shadowColor: '#000', shadowOffset: {width: 1, height: 2}, shadowOpacity: 0.2, shadowRadius: 0.2, elevation: 2},
});

export default HomeScreen;

