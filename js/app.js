let variablesMatematicas = {
    gastosFijosPorBolo: 30,
    porcentajeImpuesto: 0.15
};

window.addEventListener('DOMContentLoaded', function() {
    cargarConfiguracion();
    calcularGlosses();
});

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
    }
}

function aplicarConfiguracion() {
    document.getElementById('main-title').innerText = document.getElementById('admin-title').value;
    document.getElementById('main-subtitle').innerText = document.getElementById('admin-subtitle').value;

    document.getElementById('label-input1').innerText = document.getElementById('admin-label1').value;
    document.getElementById('label-input2').innerText = document.getElementById('admin-label2').value;
    document.getElementById('label-input3').innerText = document.getElementById('admin-label3').value;

    document.getElementById('label-res1').innerText = document.getElementById('admin-res1').value;
    document.getElementById('label-res2').innerText = document.getElementById('admin-res2').value;
    document.getElementById('label-res3').innerText = document.getElementById('admin-res3').value;
    document.getElementById('label-res-total').innerText = document.getElementById('admin-res-total').value;

    variablesMatematicas.gastosFijosPorBolo = parseFloat(document.getElementById('admin-gastos-fijos').value) || 0;
    variablesMatematicas.porcentajeImpuesto = parseFloat(document.getElementById('admin-impuesto').value) || 0;

    calcularGlosses();
    alert('✓ Configuración aplicada correctamente');
}

function guardarConfiguracion() {
    const config = {
        mainTitle: document.getElementById('admin-title').value,
        mainSubtitle: document.getElementById('admin-subtitle').value,
        label1: document.getElementById('admin-label1').value,
        label2: document.getElementById('admin-label2').value,
        label3: document.getElementById('admin-label3').value,
        res1: document.getElementById('admin-res1').value,
        res2: document.getElementById('admin-res2').value,
        res3: document.getElementById('admin-res3').value,
        resTotal: document.getElementById('admin-res-total').value,
        gastosFijos: parseFloat(document.getElementById('admin-gastos-fijos').value),
        impuesto: parseFloat(document.getElementById('admin-impuesto').value),
        bolos: parseFloat(document.getElementById('input-bolos').value),
        cache: parseFloat(document.getElementById('input-cache').value),
        experiencia: document.getElementById('select-experiencia').value
    };
    
    localStorage.setItem('djCalculatorConfig', JSON.stringify(config));
    alert('💾 Configuración guardada en tu navegador');
}

function cargarConfiguracion() {
    const configGuardada = localStorage.getItem('djCalculatorConfig');
    
    if (configGuardada) {
        const config = JSON.parse(configGuardada);
        
        document.getElementById('admin-title').value = config.mainTitle || 'DJ Earning Estimator';
        document.getElementById('admin-subtitle').value = config.mainSubtitle || 'Calcula tus ingresos potenciales por evento';
        document.getElementById('admin-label1').value = config.label1 || 'Número de Bolos / Eventos al mes:';
        document.getElementById('admin-label2').value = config.label2 || 'Caché promedio por evento (€):';
        document.getElementById('admin-label3').value = config.label3 || 'Nivel de Experiencia / Equipo:';
        document.getElementById('admin-res1').value = config.res1 || 'Ingresos Brutos Estimados:';
        document.getElementById('admin-res2').value = config.res2 || 'Multiplicador por Infraestructura:';
        document.getElementById('admin-res3').value = config.res3 || 'Gastos Estimados (Transporte/Amortización):';
        document.getElementById('admin-res-total').value = config.resTotal || 'BENEFICIO NETO MENSUAL:';
        document.getElementById('admin-gastos-fijos').value = config.gastosFijos || 30;
        document.getElementById('admin-impuesto').value = config.impuesto || 0.15;
        document.getElementById('input-bolos').value = config.bolos || 4;
        document.getElementById('input-cache').value = config.cache || 250;
        document.getElementById('select-experiencia').value = config.experiencia || 1;
        
        aplicarConfiguracion();
    }
}

function resetearConfiguracion() {
    if (confirm('¿Estás seguro de que quieres restaurar todos los valores por defecto?')) {
        localStorage.removeItem('djCalculatorConfig');
        
        document.getElementById('admin-title').value = 'DJ Earning Estimator';
        document.getElementById('admin-subtitle').value = 'Calcula tus ingresos potenciales por evento';
        document.getElementById('admin-label1').value = 'Número de Bolos / Eventos al mes:';
        document.getElementById('admin-label2').value = 'Caché promedio por evento (€):';
        document.getElementById('admin-label3').value = 'Nivel de Experiencia / Equipo:';
        document.getElementById('admin-res1').value = 'Ingresos Brutos Estimados:';
        document.getElementById('admin-res2').value = 'Multiplicador por Infraestructura:';
        document.getElementById('admin-res3').value = 'Gastos Estimados (Transporte/Amortización):';
        document.getElementById('admin-res-total').value = 'BENEFICIO NETO MENSUAL:';
        document.getElementById('admin-gastos-fijos').value = 30;
        document.getElementById('admin-impuesto').value = 0.15;
        document.getElementById('input-bolos').value = 4;
        document.getElementById('input-cache').value = 250;
        document.getElementById('select-experiencia').value = 1;
        
        aplicarConfiguracion();
        alert('🔄 Valores restaurados a los valores por defecto');
    }
}

function calcularGlosses() {
    const bolos = parseFloat(document.getElementById('input-bolos').value) || 0;
    const cache = parseFloat(document.getElementById('input-cache').value) || 0;
    const multiplicadorExperiencia = parseFloat(document.getElementById('select-experiencia').value) || 1;

    const ingresosBrutos = (bolos * cache) * multiplicadorExperiencia;
    const gastosCalculados = (bolos * variablesMatematicas.gastosFijosPorBolo) + (ingresosBrutos * variablesMatematicas.porcentajeImpuesto);
    const beneficioNeto = ingresosBrutos - gastosCalculados;

    document.getElementById('res-bruto').innerText = ingresosBrutos.toFixed(2) + ' €';
    document.getElementById('res-bonus').innerText = multiplicadorExperiencia + 'x';
    document.getElementById('res-gastos').innerText = gastosCalculados.toFixed(2) + ' €';
    document.getElementById('res-neto').innerText = beneficioNeto.toFixed(2) + ' €';
}

function exportarResultados() {
    const bolos = parseFloat(document.getElementById('input-bolos').value) || 0;
    const cache = parseFloat(document.getElementById('input-cache').value) || 0;
    const experiencia = document.getElementById('select-experiencia').options[document.getElementById('select-experiencia').selectedIndex].text;
    
    const bruto = document.getElementById('res-bruto').innerText;
    const bonus = document.getElementById('res-bonus').innerText;
    const gastos = document.getElementById('res-gastos').innerText;
    const neto = document.getElementById('res-neto').innerText;

    const fecha = new Date().toLocaleDateString('es-ES');

    const texto = `
╔════════════════════════════════════════╗
║    DJ EARNINGS CALCULATOR - RESULTADO  ║
╠════════════════════════════════════════╣
║ Fecha: ${fecha}
║
║ DATOS DE ENTRADA:
║ • Eventos/mes: ${bolos}
║ • Caché promedio: €${cache}
║ • Nivel: ${experiencia}
║
║ RESULTADOS:
║ • Ingresos Brutos: ${bruto}
║ • Multiplicador: ${bonus}
║ • Gastos: ${gastos}
║ • BENEFICIO NETO: ${neto}
╚════════════════════════════════════════╝
    `;

    navigator.clipboard.writeText(texto).then(() => {
        alert('📋 Resultados copiados al portapapeles');
        descargarTXT(texto, `dj-earnings-${fecha.replace(/\//g, '-')}.txt`);
    }).catch(() => {
        alert('⚠️ No se pudo copiar. Descargando archivo...');
        descargarTXT(texto, `dj-earnings-${fecha.replace(/\//g, '-')}.txt`);
    });
}

function descargarTXT(contenido, nombreArchivo) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
    element.setAttribute('download', nombreArchivo);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}