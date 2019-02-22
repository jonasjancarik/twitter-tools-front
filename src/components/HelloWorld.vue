<template>
<div class="container">
  <div class="row mt-5">
    <div class="col text-center">
      <h1>
        Twitter Tools
      </h1>
      <p>
        {{ msg }}
      </p>
    </div><!-- /.col -->
  </div><!-- /.row -->
</div><!-- /.container -->
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
