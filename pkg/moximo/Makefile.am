
kubernetesdir = $(pkgdatadir)/kubernetes
nodist_kubernetes_DATA = \
	pkg/moximo/app.min.css.gz \
	pkg/moximo/index.min.html.gz \
	pkg/moximo/kubernetes.min.js.gz \
	$(NULL)
kubernetes_DATA = \
	pkg/moximo/manifest.json \
	$(NULL)

kubernetes_VIEWS = \
	pkg/moximo/views/containers-page.html \
	pkg/moximo/views/container-body.html \
	pkg/moximo/views/container-panel.html \
	pkg/moximo/views/dashboard-page.html \
	pkg/moximo/views/default-panel.html \
	pkg/moximo/views/deploymentconfig-panel.html \
	pkg/moximo/views/details-page.html \
	pkg/moximo/views/filter-bar.html \
	pkg/moximo/views/images-page.html \
	pkg/moximo/views/imagerepository-panel.html \
	pkg/moximo/views/pod-body.html \
	pkg/moximo/views/pod-panel.html \
	pkg/moximo/views/node-panel.html \
	pkg/moximo/views/replicationcontroller-panel.html \
	pkg/moximo/views/route-panel.html \
	pkg/moximo/views/service-panel.html \
	pkg/moximo/views/topology-page.html \
	$(NULL)

kubernetesdebugdir = $(debugdir)$(kubernetesdir)
kubernetesdebug_DATA = \
	pkg/moximo/adjust.js \
	pkg/moximo/app.css \
	pkg/moximo/app.js \
	pkg/moximo/client.js \
	pkg/moximo/config.js \
	pkg/moximo/containers.css \
	pkg/moximo/containers.js \
	pkg/moximo/container-terminal.js \
	pkg/moximo/container-terminal.css \
	pkg/moximo/dashboard.js \
	pkg/moximo/details.css \
	pkg/moximo/details.js \
	pkg/moximo/graphs.js \
	pkg/moximo/images.css \
	pkg/moximo/images.js \
	pkg/moximo/index.html \
	pkg/moximo/kubernetes.js \
	pkg/moximo/node.js \
	pkg/moximo/object-describer.js \
	pkg/moximo/deploy.js \
	pkg/moximo/revealable.css \
	pkg/moximo/topology.css \
	pkg/moximo/topology.js \
	pkg/moximo/topology-graph.css \
	pkg/moximo/topology-graph.js \
	pkg/moximo/nulecule.js \
	$(NULL)
kubernetesviewsdebugdir = $(debugdir)$(kubernetesdir)/views
kubernetesviewsdebug_DATA = \
	$(kubernetes_VIEWS) \
	$(NULL)

kubernetes_BUNDLE = \
	pkg/moximo/adjust.min.js \
	pkg/moximo/app.min.js \
	pkg/moximo/client.min.js \
	pkg/moximo/config.min.js \
	pkg/moximo/containers.min.js \
	pkg/moximo/dashboard.min.js \
	pkg/moximo/deploy.min.js \
	pkg/moximo/details.min.js \
	pkg/moximo/graphs.min.js \
	pkg/moximo/images.min.js \
	pkg/moximo/nulecule.min.js \
	pkg/moximo/node.min.js \
	pkg/moximo/object-describer.min.js \
	pkg/moximo/topology.min.js \
	pkg/moximo/topology-graph.min.js \
	pkg/moximo/container-terminal.min.js \
	pkg/moximo/templates.js \
	pkg/moximo/kubernetes.js \
	$(NULL)

# Bundles all the view templates into a $templateCache loadable
pkg/moximo/templates.js: $(kubernetes_VIEWS)
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/ngbundle -d moximo/app -o $@ $^

# Everything else into a nice big bundle
pkg/moximo/kubernetes.min.js: $(kubernetes_BUNDLE)
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/jsbundle $@ $^

kubernetes_TESTS = \
	pkg/moximo/test-kubernetes.html \
	$(NULL)

TESTS += $(kubernetes_TESTS)

CLEANFILES += \
	pkg/moximo/app.min.css \
	pkg/moximo/index.min.html \
	pkg/moximo/kubernetes.min.js \
	$(kubernetes_BUNDLE) \
	$(nodist_kubernetes_DATA) \
	$(NULL)

EXTRA_DIST += \
	pkg/moximo/app.min.css \
	pkg/moximo/index.min.html \
	pkg/moximo/kubernetes.min.js \
	$(kubernetes_BUNDLE) \
	$(NULL)

update-lib:: update-bower
	$(JSMODULE) -m -d base1/angular -o $(srcdir)/pkg/moximo/object-describer.js \
	    $(BOWER)/kubernetes-object-describer/dist/object-describer.js
