import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, input, table, tr, td, th } = hh(h);

function view(dispatch, m) {
  return div({ className: "flex flex-col gap-4" }, [

    div({ className: "flex gap-2" }, [
      input({
        className: "border p-2 flex-1",
        placeholder: "Meal",
        value: m.name,
        oninput: e => dispatch({ name: e.target.value })
      }),

      input({
        className: "border p-2 w-32",
        type: "number",
        placeholder: "Calories",
        value: m.cal,
        oninput: e => dispatch({ cal: e.target.value })
      }),

      button({
        className: "bg-green-500 text-white px-4 rounded",
        onclick: () => dispatch({ add: true })
      }, "Save")
    ]),

    table({ className: "border w-full text-center" }, [

      tr({ className: "font-bold border-b" }, [
        th("Meal"), th("Calories"), th("")
      ]),

      ...m.meals.map((meal, i) =>
        tr({ className: "border-b" }, [
          td(meal.name),
          td(meal.cal),
          td(
            button({
              className: "bg-red-500 text-white px-2 rounded",
              onclick: () => dispatch({ del: i })
            }, "X")
          )
        ])
      ),

      tr({ className: "font-bold" }, [
        td("Total"),
        td(m.meals.reduce((t, x) => t + +x.cal, 0)),
        td("")
      ])
    ])
  ]);
}

function update(msg, m) {

  if ("name" in msg) return { ...m, name: msg.name };
  if ("cal" in msg) return { ...m, cal: msg.cal };

  if (msg.add && m.name && m.cal)
    return { meals: [...m.meals, { name: m.name, cal: m.cal }], name: "", cal: "" };

  if ("del" in msg)
    return { ...m, meals: m.meals.filter((_, i) => i !== msg.del) };

  return m;
}

function app(model, update, view, node) {
  let vdom = view(dispatch, model);
  let root = createElement(vdom);
  node.appendChild(root);

  function dispatch(msg) {
    model = update(msg, model);
    const newVdom = view(dispatch, model);
    root = patch(root, diff(vdom, newVdom));
    vdom = newVdom;
  }
}

app({ meals: [], name: "", cal: "" }, update, view, document.getElementById("app"));