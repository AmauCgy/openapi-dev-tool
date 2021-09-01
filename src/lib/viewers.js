// ##################################################################
// This defines the express middlewares of viewers:
// - SwaggerUI
// - Redoc
// - Home (to list API)
//
// Home is used to displayed API before going to Redoc
// It is not necessary for SwaggerUI viewer because this tool can
// already manage several specs
// ##################################################################

export default function middleware(specs, config) {
  // Manage HTML injector
  let htmlInjector = config.config['html-injector'];
  if (config.config['html-injector']) {
    if (Array.isArray(config.config['html-injector'])) {
      htmlInjector = config.config['html-injector'].join('\n');
    }
  }

  return {
    // To be able to update new specs (after change)
    updateSpecs: (newSpecs) => {
      specs = newSpecs;
    },
    // Express middleware for Swagger UI
    swaggerUI: (req, res) => {
      res.render('swagger-ui', {
        // All specs are provided to SwaggerUI
        specs: specs.map((spec) => {
          return {
            name: spec.name,
            url: spec.url,
          };
        }),
        htmlInjector,
      });
    },
    // Express middleware for Redoc
    redoc: (req, res, next) => {
      // Just one spec has been selected
      const spec = specs.find((spec) => {
        return spec.name === req.query.specName;
      });

      if (spec) {
        res.render('redoc', {
          spec: {
            url: spec.url,
          },
          htmlInjector,
        });
      } else {
        next();
      }
    },
    // Express middleware for Home
    home: (req, res) => {
      // Display the whole of API
      res.render('apis', {
        specs,
        htmlInjector,
      });
    },
  };
}
