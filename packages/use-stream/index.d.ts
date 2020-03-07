import Debug from "debug";

export as namespace useStream;

export function useStream<TModel>(props: UseStream.UseStreamProps<TModel>): TModel

export namespace UseStream {

  type TStream = {
    map: (_: any) => any;
  } & any;

  interface IModel {
    [key: string]: TStream;
  }

  type TModelFn<TModel> = (_?: any) => TModel

  type TModelGen<TModel> = TModel | TModelFn<TModel>

  
  type UseStreamProps<TModel> = {
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
     * For more flexibility, pass a function that returns the model object. See also `defer`
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
    model: TModelGen<TModel>;

    /**
     * Callback method to run side effects when the containing component is mounted.
     */
    onMount?: (model: TModel) => any;

    /**
     * Callback method to run side effects when the containing component is updated through deps.
     */
    onUpdate?: (model: TModel) => any;

    /**
     * Callback method to clean up side effects. onDestroy is called
     * when the containing component goes out of scope.
     */
    onDestroy?: (model: TModel) => any;

    /**
     * React hooks deps array. Default [].
     */
    deps?: React.DependencyList;

    /**
     * Debugger instance.
     * See: https://www.npmjs.com/package/debug
     */
    debug?: Debug.Debugger;

  }
}

