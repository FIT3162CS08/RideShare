// src/hooks/useFetch.ts
"use client";

import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(data)

  useEffect(() => {
    if (!url) return;

    let isMounted = true; // prevent setting state on unmounted component

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setData({
        id: "1",
        name: "Leanne Graham",
        user_url: "https://oishi-eizo.com/wp-content/uploads/2025/05/1.15.1_1.15.1-e1752915828270-1024x1005.webp",
        trips_count: 105,
        banner_type: "",
        username: "Bret",
        email: "Sincere@april.biz",
        address: {
          street: "main streen",
          no: "116",
          city: "Melbourne",
          zipcode: "3076",
        },
        main_campus: "Clayton",
        phone: "1-770-736-8031",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate soluta ipsum aperiam ab, culpa illum totam minus laudantium illo. Fugiat quas repudiandae debitis magni, sint provident a necessitatibus magnam quae doloribus architecto, aut nesciunt aliquid nemo ducimus, amet ut adipisci laudantium dignissimos consequuntur voluptatum inventore ipsam blanditiis. Consequatur at nemo obcaecati consequuntur! Quo qui corporis atque eos beatae, maiores distinctio, doloribus alias est officia repudiandae dolore amet debitis nesciunt? Veritatis consequuntur odio omnis repellat! Qui, voluptas! Tempora, fugiat ex optio doloribus quaerat cupiditate tenetur fugit pariatur facere incidunt sed quae odio consequatur ad laborum atque suscipit molestiae. Qui, nam saepe!"
      })
    }, 1)
    /*
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) setData(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    */
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
