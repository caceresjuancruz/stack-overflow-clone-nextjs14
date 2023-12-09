import { getErrorMessage } from "../utils";
import { JobFilterParams } from "./shared.types";

export const fetchLocation = async () => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=country");
    const location = await response.json();

    return location.country;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
};

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;

  try {
    const headers = {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    };

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
      {
        headers,
      }
    );

    const result = await response.json();

    return result.data;
  } catch (error) {
    return {
      message: getErrorMessage(error),
    };
  }
};
