import type { LoaderFunction } from "@remix-run/node";
import { ActionFunction, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useFetcher, useLoaderData, useNavigation } from "@remix-run/react";

const fruitById: Record<number, string> = {
  1: "apple",
  2: "banana",
  3: "orange",
}

const idByFruit: Record<string, number> = {
  "apple": 1,
  "banana": 2,
  "orange": 3,
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fruit = formData.get("fruit");
  invariant(typeof fruit === "string", "Fruit is required")
  const id = idByFruit[fruit];
  // Delay by 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return redirect(`/fruit/${id}`);
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(typeof params.fruitId === "string", "Fruit ID is required")
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json({ fruit: fruitById[Number(params.fruitId)] })
}

const toFormData = (fruit: string) => {
  const formData = new FormData();
  formData.append("fruit", fruit);
  return formData;
}

export default function Fruit() {
  const data = useLoaderData()
  const fetcher = useFetcher();
  const navigation = useNavigation();

  const optimisticValue = fetcher.formData ? fetcher.formData.get("fruit") : data.fruit;

  console.log("optimisticValue", optimisticValue, navigation.state, navigation.location?.pathname, fetcher.state)

  return (
    <div>
      {Object.values(fruitById).map((fruit) => (
        <div key={fruit}>
          <input
            type="radio"
            id={fruit}
            name="fruit"
            value={fruit}
            checked={fruit === optimisticValue}
            onChange={() => {
              fetcher.submit(toFormData(fruit), { method: "post" })}
            }/>
          <label htmlFor={fruit}>{fruit}</label><br/>
        </div>
      ))}

      Fruit: {optimisticValue}
      {navigation.state === "loading" && fetcher.state === 'idle' && <div style={{ backgroundColor: 'red', height: 50, width: 100 }}>Loading...</div>}
    </div>
  )
}
