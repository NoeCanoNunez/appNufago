export const ordenarPor = (objetos, propiedades, modosOrden) => {
    return [...objetos].sort((a, b) =>
      propiedades.reduce((acumulador, p, i) => {
        if (acumulador === 0) {
          let [m, n] =
            modosOrden && modosOrden[i] === "DESCENDENTE"
              ? [b[p], a[p]]
              : [a[p], b[p]];
  
          if (isNaN(m) || isNaN(n)) {
            acumulador = m > n ? 1 : m < n ? -1 : 0;
          } else {
            acumulador =
              parseFloat(m) > parseFloat(n)
                ? 1
                : parseFloat(m) < parseFloat(n)
                ? -1
                : 0;
          }
        }
  
        return acumulador;
      }, 0)
    );
  };
  // let computadores = [
  //     {id: 37, marca: 'Intel'},
  //     {id: 31, marca: 'Apple'},
  //     {id: 29, marca: 'MSi'},
  //     {id: 31, marca: 'Samsung'},
  // ];
  
  // let resultado = orderPor(computadores, ['id', 'marca'], ['ASCENDENTE', 'DESCENDENTE']);
  // console.log(resultado);
  
  // resultado = orderPor(computadores, ['id', 'marca'], ['DESCENDENTE', 'ASCENDENTE']);
  // console.log(resultado);