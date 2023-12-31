import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import styles from './nearbyjobs.style';
import { COLORS } from '../../../constants';
import NearbyJobCard from '../../common/cards/nearby/NearbyJobCard';
import useFetch from '../../../hook/useFetch';
import {
  jobCountryCode,
  jobRadius,
  nearbyJobTerm,
} from '../../../constants/config';

const NearbyJobs = () => {
  const router = useRouter();

  const { data, isLoading, error } = useFetch('search', {
    query: nearbyJobTerm,
    country: jobCountryCode,
    radius: jobRadius,
    num_pages: 1,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby</Text>
        <TouchableOpacity
          onPress={() => router.push(`/nearby-jobs/${nearbyJobTerm}`)}
        >
          <Text style={styles.headerBtn}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" colors={COLORS.primary} />
        ) : error ? (
          <Text>OOPS! Something went wrong.</Text>
        ) : (
          data?.map((job) => (
            <NearbyJobCard
              key={job?.job_id}
              job={job}
              handleNavigate={() => router.push(`/job-details/${job.job_id}`)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default NearbyJobs;
