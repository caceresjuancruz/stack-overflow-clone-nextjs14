import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:
        process.env.NEXT_PUBLIC_SERVER_URL ||
        "https://caceresjuan-devflow.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}community`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}collections`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}jobs`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}tags`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}ask-question`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}sign-in`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}sign-up`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
