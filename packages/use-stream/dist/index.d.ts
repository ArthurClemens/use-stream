import type Debug from 'debug';
declare type DependencyList = ReadonlyArray<unknown>;
declare type TMaybeDeferredModel<TModel> = TModel & {
  isDeferred?: boolean;
};
declare type TModelFn<TModel> = (_?: unknown) => TMaybeDeferredModel<TModel>;
declare type TModelGen<TModel> = TModel | TModelFn<TModel>;
declare type Props<TModel> = {
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
   *
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
  onMount?: (model: TModel) => unknown;
  /**
   * Callback method to run side effects when the containing component is updated through deps.
   */
  onUpdate?: (model: TModel) => unknown;
  /**
   * Callback method to clean up side effects. onDestroy is called
   * when the containing component goes out of scope.
   */
  onDestroy?: (model: TModel | null) => unknown;
  /**
   * React hooks deps array. Default [].
   */
  deps?: DependencyList;
  /**
   * Defers initialization of the model to the mount useEffect.
   */
  defer?: boolean;
  /**
   * Debugger instance.
   * See: https://www.npmjs.com/package/debug
   */
  debug?: Debug.Debugger;
};
export declare const useStream: <TModel>({
  model,
  onMount,
  onDestroy,
  onUpdate,
  deps,
  defer,
  debug,
}: Props<TModel>) => TMaybeDeferredModel<TModel>;
export {};
