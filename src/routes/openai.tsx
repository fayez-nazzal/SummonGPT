import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, JSX } from "solid-js";
import { checkOpenAIAuth } from "../openai";
import { EStorageKey, getStoredValue, setStoredValue } from "../storage";

const OpenAIEnvRoute = () => {
  const [apiKey, setAPIKey] = createSignal(
    getStoredValue(EStorageKey.OpenAIKey, "")
  );
  const [isInvalid, setIsInvalid] = createSignal(false);
  const navigate = useNavigate();

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setAPIKey((e.target as HTMLInputElement).value);
  };

  const onApply = async () => {
    if ((await checkOpenAIAuth(apiKey())) === false) {
      setIsInvalid(true);
      setAPIKey("");
      return;
    }

    setStoredValue(EStorageKey.OpenAIKey, apiKey());
    navigate("/");
  };

  return (
    <div class="p-5 text-center">
      <div class="text-textPrimary font-medium text-lg leading-8">
        An OpenAI API key is required to use this app.
      </div>
      <div class="text-textPrimary text-sm leading-6">
        Please follow the steps on the{" "}
        <a
          class="text-blue-500 mx-1"
          href="https://github.com/fayez-nazzal/SummonGPT"
          target="_blank"
        >
          GitHub repo
        </a>{" "}
        to obtain one
      </div>

      <div class="flex flex-col items-center gap-4 mt-4">
        <input
          type="text"
          class={scn(
            "w-96 h-11",
            "text-xs text-textPrimary placeholder:text-textPrimary/80",
            "bg-plane",
            "border border-melt/40",
            "rounded-lg cursor-text p-3 focus:outline-none"
          )}
          placeholder="Your OpenAI API Key"
          oninput={onChange}
          value={apiKey()}
        />

        <div
          class={scn(
            ["invisible opacity-0", !isInvalid()],
            "text-error text-sm leading-6"
          )}
        >
          Invalid API key
        </div>

        <button
          class={scn(
            "bg-primary rounded-lg",
            "disabled:grayscale enabled:hover:brightness-110",
            "px-3 py-2",
            "font-medium text-lg text-textPrimary-dark"
          )}
          disabled={!apiKey()}
          onclick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default OpenAIEnvRoute;
