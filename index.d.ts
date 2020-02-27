import "react";
import Stream from "mithril/stream";

type Model = {
  [key:string]: Stream<any>;
}

export type UseStream = ({ model, onMount, onDestroy } : {
  model: Model;
  onMount?: (model: Model) => any;
  onDestroy?: (model: Model) => any;
}) => Model;
