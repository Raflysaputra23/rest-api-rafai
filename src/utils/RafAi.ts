import axios from "axios";

interface RafAiProps {
  session: string;
  prompt: string;
}

const RafAi = (message: string, { session, prompt }: RafAiProps) => {
  return new Promise(async (resolve: Function, reject: Function) => {
    try {
      const { data } = await axios.get(
        `https://kizhbotz.online/AIchat?message=${message}&sifat=${prompt}&session=${session}&apikey=kizh-api-key`
      );
      if (!data)
        throw new Error(
          "Maaf RafAi mengalami kegagalan respons silahkan coba lagi"
        );

      resolve(data.data.response);
    } catch (error) {
      reject(error);
    }
  });
};

export default RafAi;
