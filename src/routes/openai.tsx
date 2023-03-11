const OpenAIEnvRoute = () => {
  return (
    <div class="p-5 text-center">
      <div class="text-textPrimary font-medium text-lg leading-8">
        Your OpenAI API key is required to use this app.
      </div>
      <div class="text-textPrimary text-sm leading-6">
        Please follow the instructions on the{" "}
        <a href="https://github.com/fayez-nazzal/SummonGPT" target="_blank">
          GitHub repo
        </a>{" "}
        to export your API key.
      </div>
    </div>
  );
};

export default OpenAIEnvRoute;
