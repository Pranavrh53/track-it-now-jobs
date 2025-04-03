
import { IndeedJobListing, IndeedSearchParams, IndeedSearchResponse } from "@/types/job";

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY || '';
const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST || 'indeed-jobs-api.p.rapidapi.com';

export const searchIndeedJobs = async (params: IndeedSearchParams): Promise<IndeedSearchResponse> => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('query', params.keyword);
    if (params.location) queryParams.append('location', params.location);
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };

    const response = await fetch(`https://${RAPID_API_HOST}/search?${queryParams}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      jobs: data.jobs || [],
      totalResults: data.totalResults || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1
    };
  } catch (error) {
    console.error('Failed to fetch jobs from Indeed API:', error);
    return {
      jobs: [],
      totalResults: 0,
      currentPage: 1,
      totalPages: 1
    };
  }
};

export const getIndeedJob = async (jobId: string): Promise<IndeedJobListing | null> => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };

    const response = await fetch(`https://${RAPID_API_HOST}/job-details?id=${jobId}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch job details from Indeed API:', error);
    return null;
  }
};
