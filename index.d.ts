
export namespace UseStream {

  type Model = {
    [key:string]: Stream<any>;
  }

  type ModelFn = (_?:any) => Model

  export type useStream = ({ model, onMount, onDestroy, initLazily } : {
    /**
     * The model is a POJO object with (optionally multiple) streams.
     * `useStream` returns this model once it is initialized.
     * 
     * Example:
     * 
     * const model = useStream({
     *   model: {
     *     index: stream(0),
     *     count: stream(3)
     *   }
     * })
     * 
     * const { index, count } = model
     * 
     * 
     * For more flexibility, pass a function that returns the model object. See also `initLazily` 
     * how to combine this for optimization.
     * 
     * Example:
     * 
     * const { index, count } = useStream({
     *   model: () => {
     *     const index = stream(0)
     *     const count = stream(3)
     *     count.map(console.log) // another stream that is subscribed to the count stream
     *     return {
     *       index,
     *       count
     *     }
     *   }
     * })
     */
    model: Model | ModelFn;

    /**
     * Callback method to run side effects when the containing component is mounted.
     */
    onMount?: (model: Model) => any;

    /**
     * Callback method to clean up side effects and to stop streams (if necessary). This is called
     * when the containing component goes out of scope.
     */
    onDestroy?: (model: Model) => any;

    /**
     * Optimization to prevent that stream initialization functions are ran at each render.
     * The default behavior does not mean that streams are reset (as their results are memoized),
     * but this optimization may prevent problems when model streams involve calling side effects.
     * Technically, `initLazily` will postpone the initialization functions until after the first
     * render (in React.useEffect). That means that in the first render the model will not be
     * available yet.
     * 
     * Example:
     * 
     * const model = useStream({
     *   initLazily: true,
     *   model: {
     *     index: stream(0),
     *     count: stream(3)
     *   }
     * })
     * 
     * if (!model) {
     *   return null
     * }
     * 
     * const { index, count } = model
     * 
     * 
     * When the model is created by a factory function, you should combine this optimization with
     * the "pass a function that returns the model" approach (see: model).
     * 
     * Example:
     * 
     * const createModel = ({ defaultIndex = 0 }) => {
     *   const index = stream(defaultIndex)
     *   // Possibly creates other streams and methods on streams...
     * 
     *   return {
     *     index
     *   }
     * }
     * 
     * const model = useStream({
     *   initLazily: true,
     *   model: createModel({ defaultIndex: 1 })
     * })
     * 
     * if (!model) {
     *   return null
     * }
     * 
     * const { index } = model
     * 
     */
    initLazily?: boolean;
  }) => Model;

}
