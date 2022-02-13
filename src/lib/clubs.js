import {supabase} from './api';
import {useQuery} from 'react-query';

export const fetchClubs = async ({limit = 10, maxCapacity = 0}) => {
  let { data, error } = await supabase
    .from("clubs")
    .select("*")
    .limit(limit)
    .gte('max_capacity', maxCapacity)
  return data;
}

export const useFetchClubsQuery = ({limit, maxCapacity}) => {
  return useQuery(
    ['clubs', {limit, maxCapacity}],
    () => fetchClubs({limit, maxCapacity}),
  )
}