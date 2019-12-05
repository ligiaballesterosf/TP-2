const localPc = require('./ventas'),
    agregarVenta = localPc.agregarVenta,
    ventas = localPc.ventas,
    ventaPromedio = localPc.ventaPromedio,
    obtenerIdVenta = localPc.obtenerIdVenta,
    vendedoras = localPc.vendedoras,
    precios = localPc.precios,
    sucursales = localPc.sucursales,
    cantidadVentasComponente = localPc.cantidadVentasComponente,
    verificarExistenciaComponente = localPc.verificarExistenciaComponente,
    componenteMasVendido = localPc.componenteMasVendido,
    ventasVendedora = localPc.ventasVendedora,
    precioMaquina = localPc.precioMaquina,
    ventasSucursal = localPc.ventasSucursal,
    mejorVendedora = localPc.mejorVendedora;


describe('pruebas en agregar venta sin numero random', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
        localPc.ventas.splice(0);
    });

    afterEach(() => {
        global.Math.random.mockRestore();
    });
    test('agrego una venta revisando el array 0 completo', () => {
        agregarVenta(15, 12, 2018, "Ada", "Caballito", 'Monitor GPRS 3000');
        expect(ventas[0]).toStrictEqual([
            obtenerIdVenta(),
            15,
            12,
            2018,
            "Ada",
            "Caballito",
            ['Monitor GPRS 3000']
        ]);
    });
});

test('obtengo un ID de venta random', () => {
    expect(obtenerIdVenta()).toBeGreaterThanOrEqual(100000000);
    expect(obtenerIdVenta()).toBeLessThanOrEqual(999999999);

});

test('chequear que todos los parametros esten completos', () => {
    expect(() => {
        agregarVenta("", "", "", "ada", "caballito", 'Monitor GPRS 3000');
    }).toThrow("Error - Completar todos los datos de la venta.")
});

test('chequear que todos los parametros esten completos - version 2', () => {
    expect(() => {
        agregarVenta(3, 2, 2017, "ada", "caballito");
    }).toThrow("Error en carga de producto, debe completar los componetes vendidos.")
});

test('escribir sucursal que no coincida con una existente, y tire error', () => {
    expect(() => {
        agregarVenta(15, 12, 2018, "ada", "Flores", 'Monitor GPRS 3000')
    })
        .toThrow("Sucursal no encontrada.")
});

test('chequear que el parametro nombre coincida con una vendedora, sino tire error', () => {
    expect(() => {
        agregarVenta(15, 12, 2018, "Antonella", "Caballito", 'Monitor GPRS 3000')
    })
        .toThrow('Vendedor no registrado.')
});

test('escribir nombre de vendedora en mayusculas y que se agregue venta igual', () => {
    agregarVenta(15, 12, 2018, "GRACE", "Caballito", "Monitor GPRS 3000");
    expect(ventas[0][4]).toBe("Grace");
});


test('chequear que el parametro componente coincida con una en el stock', () => {
    agregarVenta(22, 2, 2019, "Hedy", "Centro", 'RAM Quinston');
    expect(ventas[0][6]).toStrictEqual(["RAM Quinston"]);
});

test('chequear que el parametro componente coincida con una en el stock', () => {
    expect(() => {
        agregarVenta(23, 2, 2018, "Ada", "Caballito", 'RAM PRUEBA')
    }).toThrow("Articulo no Existe")
});

test('chequear que el push permita subir varios productos en una misma venta', () => {
    agregarVenta(22, 2, 2019, "Hedy", "Centro", 'RAM Quinston', "Monitor GPRS 3000");
    expect(ventas[0][6]).toStrictEqual(["RAM Quinston", "Monitor GPRS 3000"]);
});


test('chequear que la fecha no superea al dia de hoy', () => {
    agregarVenta(22, 2, 2019, "Hedy", "Centro", 'RAM Quinston', "Monitor GPRS 3000");
    expect(ventas[0]).toHaveLength(7);
});

test('chequear que la fecha si supera el dia de hoy tire error', () => {
    expect(() => {
        agregarVenta(22, 12, 2019, "Hedy", "Centro", 'RAM Quinston', "Monitor GPRS 3000");
    }).toThrow("Error - la fecha ingresada es mayor al día actual.");
});

test('chequear que la venta promedio de todas las ventas sea 367 ',()=>{
    agregarVenta(22, 10, 2019, "Hedy", "Centro", 'RAM Quinston', "Monitor GPRS 3000");
    agregarVenta(22, 2, 2019, "Ada", "Caballito", 'Motherboard ASUS 1500', 'HDD Wezter Dishital','RAM Quinston Fury');
    expect(ventaPromedio()).toBe(367)
});

beforeEach(() => {
    localPc.ventas.splice(0);
});


describe('Verificar existencia de un componente', () => {

    test('existe', () => {
        expect(verificarExistenciaComponente('Monitor GPRS 3000')).toBe(true)
    });

    test('NO existe', () => {
        expect(verificarExistenciaComponente('Audifonos Razer 9800')).toBe(false)
    });
});


describe('Calcular ventas de un componente', () => {

    test('Calcular cantidad de ventas de un componente', () => {
        ventas.push([100000005, 21, 3, 2019, 'Hedy', 'Caballito', ['Monitor ASC 543', 'Motherboard ASUS 1200', 'RAM Quinston']])
        expect(cantidadVentasComponente('Monitor ASC 543')).toBe(1)
    });
    test('Componente existe, pero no tiene ventas y debe dar 0', () => {
        expect(cantidadVentasComponente('Monitor GPRS 3000')).toBe(0)
    });
    test('El componente no existe y da error', () => {
        expect(() => {
            cantidadVentasComponente('Audifonitos')
        }).toThrow('Articulo no Existe.')
    });

});

describe('Componente más vendido, si existe venta, me dice cual es el componente', () => {

    test('Si venta está vacio', () => {
        expect(componenteMasVendido()).toBe("")
    });
    test('Si hay venta me dice cual es el componente más vendido', () => {
        ventas.push([100000000, 4, 2, 2019, 'Grace', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
        [100000001, 1, 1, 2019, 'Ada', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
        [100000002, 2, 1, 2019, 'Grace', 'Caballito', ['Monitor ASC 543', 'Motherboard MZI', 'HDD Toyiva']],
        [100000003, 10, 1, 2019, 'Ada', 'Centro', ['Monitor ASC 543', 'Motherboard ASUS 1200']],
        [100000004, 12, 1, 2019, 'Grace', 'Caballito', ['Monitor GPRS 3000', 'Motherboard ASUS 1200']],
        [100000005, 21, 3, 2019, 'Hedy', 'Caballito', ['Monitor ASC 543', 'Motherboard ASUS 1200', 'RAM Quinston']]
        )
        expect(componenteMasVendido()).toBe('Monitor GPRS 3000')
    });
});

describe('Me dice el nombre de la mejor vendedora, si existen las ventas', () => {
 
    test('Si venta está vacio', () => {
        expect(mejorVendedora()).toBe("")
    });
    test('Si hay venta me dice el nombre de la mejor vendedora', () => {
        ventas.push([100000000, 4, 2, 2019, 'Grace', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
        [100000001, 1, 1, 2019, 'Ada', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
        [100000002, 2, 1, 2019, 'Grace', 'Caballito', ['Monitor ASC 543', 'Motherboard MZI', 'HDD Toyiva']],
        [100000003, 10, 1, 2019, 'Ada', 'Centro', ['Monitor ASC 543', 'Motherboard ASUS 1200']],
        [100000004, 12, 1, 2019, 'Grace', 'Caballito', ['Monitor GPRS 3000', 'Motherboard ASUS 1200']],
        [100000005, 21, 3, 2019, 'Hedy', 'Caballito', ['Monitor ASC 543', 'Motherboard ASUS 1200', 'RAM Quinston']]
        )
        expect(mejorVendedora()).toBe('Grace')
    });

});

test ("precioMaquina devuelve precio de la maquina", () => {
    const componentes =  ['Monitor GPRS 3000', 'Motherboard ASUS 1500'];
    expect(precioMaquina(componentes)).toBe(320);
});

test("ventasVendedora devuelve importe total de ventas", () => {
   ventas.push([100000000, 4, 2, 2019, 'Grace', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
   [100000001, 1, 1, 2019, 'Ada', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
   [100000002, 2, 1, 2019, 'Grace', 'Caballito', ['Monitor ASC 543', 'Motherboard MZI', 'HDD Toyiva']],
   [100000003, 10, 1, 2019, 'Ada', 'Centro', ['Monitor ASC 543', 'Motherboard ASUS 1200']],
   [100000004, 12, 1, 2019, 'Grace', 'Caballito', ['Monitor GPRS 3000', 'Motherboard ASUS 1200']],
   [100000005, 21, 3, 2019, 'Hedy', 'Caballito', ['Monitor ASC 543', 'Motherboard ASUS 1200', 'RAM Quinston']]
   );
   expect(ventasVendedora("Grace")).toBe(990.00);
});


test("ventasSucursal devuelve suma de todas las ventas de la Sucursal", () => {
    ventas.push([100000000, 4, 2, 2019, 'Grace', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
    [100000001, 1, 1, 2019, 'Ada', 'Centro', ['Monitor GPRS 3000', 'Motherboard ASUS 1500']],
    [100000002, 2, 1, 2019, 'Grace', 'Caballito', ['Monitor ASC 543', 'Motherboard MZI', 'HDD Toyiva']],
    [100000003, 10, 1, 2019, 'Ada', 'Centro', ['Monitor ASC 543', 'Motherboard ASUS 1200']],
    [100000004, 12, 1, 2019, 'Grace', 'Caballito', ['Monitor GPRS 3000', 'Motherboard ASUS 1200']],
    [100000005, 21, 3, 2019, 'Hedy', 'Caballito', ['Monitor ASC 543', 'Motherboard ASUS 1200', 'RAM Quinston']]
    );
   expect(ventasSucursal("Centro")).toBe(990);
});