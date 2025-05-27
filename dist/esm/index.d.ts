declare const RollupPluginRemoveOthersConsole: () => {
    readonly name: "rollup-plugin-remove-others-console";
    readonly enforce: "pre";
    readonly transform: (code: string, id: string) => string;
};
export default RollupPluginRemoveOthersConsole;
